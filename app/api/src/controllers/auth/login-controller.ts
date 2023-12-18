import { redirectResponse } from '#/api/src/middleware/redirect';
import { OAuthRequestError } from '@lucia-auth/oauth';
import { parseCookie } from 'lucia/utils';
import sig from 'cookie-signature-subtle';
import {
  createAuth,
  jsonOkResponse,
  badResponse,
  serverErrorResponse,
  getBaseUrl,
} from '../../middleware';

export const loginGithub = async (req: Request, res: Response, env: Env, ctx: ExecutionContext) => {
  const { auth, githubAuth } = await createAuth(env);
  const authRequest = auth.handleRequest(req);
  const session = await authRequest.validate();
  const reqUrl = new URL(req.url).href;
  if (session) {
    return redirectResponse(reqUrl, 302, res.headers);
  }
  const [url, state] = await githubAuth.getAuthorizationUrl();
  console.log(`[api] [auth] [login] [github] -> url: ${url}`);
  await res.cookie(req, res, env, 'github_oauth_state', state, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60,
    sameSite: 'none',
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
  const { baseUrlApp } = getBaseUrl(env);
  const dataPage = `${baseUrlApp}/api-data`;
  if (session) {
    return redirectResponse(dataPage, 302, res.headers);
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
    // return Response.redirect(dataPage, 302).headers.set('Set-Cookie', sessionCookie.serialize());
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
