import { redirectResponse } from '#/api/src/middleware/redirect';
import { OAuthRequestError } from '@lucia-auth/oauth';
import { parseCookie } from 'lucia/utils';
import sig from 'cookie-signature-subtle';
import { createAuth, jsonOkResponse, badResponse, serverErrorResponse } from '../../middleware';

export const logout = async (req: Request, res: Response, env: Env, ctx: ExecutionContext) => {
  const { auth } = await createAuth(env);
  const authRequest = auth.handleRequest(req);
  // check if user is authenticated
  const session = await authRequest.validate(); // or `authRequest.validateBearerToken()`
  req.logger.info(`[api] [auth] [logout] -> session:`);
  console.log(session);
  if (!session) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }
  // make sure to invalidate the current session!
  await auth.invalidateSession(session.sessionId);

  // for session cookies
  // create blank session cookie
  const sessionCookie = auth.createSessionCookie(null);
  return new Response(null, {
    headers: {
      Location: '/login', // redirect to login page
      'Set-Cookie': sessionCookie.serialize(), // delete session cookie
    },
    status: 302,
  });
};

export const loginGithub = async (req: Request, res: Response, env: Env, ctx: ExecutionContext) => {
  const { auth, githubAuth } = await createAuth(env);
  const authRequest = auth.handleRequest(req);
  const session = await authRequest.validate();
  const reqUrl = new URL(req.url).href;
  if (session) {
    return redirectResponse(reqUrl, res, 302);
  }
  const [url, state] = await githubAuth.getAuthorizationUrl();
  // console.log(`[api] [auth] [login] [github] -> url: ${url}`);
  await res.cookie(req, res, env, 'github_oauth_state', state, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60,
    sameSite: 'lax',
  });
  // res.headers.set('Access-Control-Expose-Headers', 'Set-Cookie');
  // res.headers.set(
  //   'Access-Control-Allow-Headers',
  //   'Origin, X-Requested-With, Content-Type, Accept, authorization'
  // );
  return jsonOkResponse({ url }, res);
};

export const loginGithubCallback = async (
  req: Request,
  res: Response,
  env: Env,
  ctx: ExecutionContext
) => {
  const { auth, githubAuth } = await createAuth(env);
  const authRequest = auth.handleRequest(req);
  const session = await authRequest.validate();
  if (session) {
    return redirectResponse('/', res, 302);
  }
  const cookies = parseCookie(req.headers.get('cookie') ?? '');
  // console.log(`[api] [auth] [login] [github] -> cookies: ${cookies}`);
  // console.log(cookies);
  const secret = env.NEXTAUTH_SECRET;
  console.log(cookies.github_oauth_state);
  const storedState = cookies.github_oauth_state
    ? await sig.unsign(cookies.github_oauth_state.replace('s:', ''), secret)
    : '';
  const state = req.query?.state;
  const code = req.query?.code;
  // console.log(`[api] [auth] [login] [github] -> storedState: ${storedState}`);
  // console.log(`[api] [auth] [login] [github] -> state: ${state}`);
  // console.log(`[api] [auth] [login] [github] -> code: ${code}`);
  // validate state
  if (!storedState || !state || storedState !== state || typeof code !== 'string') {
    return badResponse('Invalid state', undefined, res);
  }
  try {
    const { getExistingUser, githubUser, createUser } = await githubAuth.validateCallback(code);
    const getUser = async () => {
      const existingUser = await getExistingUser();
      // console.log(`[api] [auth] [login] [github] -> existingUser`);
      // console.log(existingUser);
      if (existingUser) return existingUser;
      const user = await createUser({
        attributes: {
          username: githubUser.login,
        },
      });
      return user;
    };

    const user = await getUser();
    // console.log(`[api] [auth] [login] [github] -> user`);
    // console.log(user);
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });
    // console.log(`[api] [auth] [login] [github] -> session`);
    // console.log(session);
    const sessionCookie = auth.createSessionCookie(session);
    sessionCookie.attributes.httpOnly = false;
    // console.log(`[api] [auth] [login] [github] -> sessionCookie`);
    // console.log(sessionCookie);
    // console.log(sessionCookie.serialize());
    res.headers.set('Set-Cookie', sessionCookie.serialize());
    // res.headers.set('Access-Control-Expose-Headers', 'Set-Cookie');
    // res.headers.set('Access-Control-Allow-Credentials', 'true');
    // res.headers.set(
    //   'Access-Control-Allow-Headers',
    //   'Origin, X-Requested-With, Content-Type, Accept, authorization'
    // );
    return jsonOkResponse({ session }, res);
  } catch (e) {
    if (e instanceof OAuthRequestError) {
      // invalid code
      return badResponse('Invalid code', undefined, res);
    }
    req.logger.error(`[api] [auth] [login] [github] -> error: ${e}`);
    return serverErrorResponse('Server error', new Error(JSON.stringify(e)), res);
  }
};
