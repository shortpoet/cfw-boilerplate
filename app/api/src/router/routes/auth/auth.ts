import { IRequest } from 'itty-router';
import { OpenAPIRouter } from '@cloudflare/itty-router-openapi';
import { getUsersFind } from '../../../controllers';
import {
  createAuth,
  jsonOkResponse,
  createGithubAuth,
  badResponse,
  serverErrorResponse,
} from '../../../middleware';
import { redirectResponse } from '#/api/src/middleware/redirect';
import { OAuthRequestError } from '@lucia-auth/oauth';
import { parseCookie } from 'lucia/utils';

type CF = [env: Env, ctx: ExecutionContext];
const router = OpenAPIRouter<IRequest, CF>({ base: '/api/auth/login' });

router.get('/github', async (req: Request, res: Response, env: Env, ctx: ExecutionContext) => {
  console.log(`[api] [auth] [login] [github]`);

  const auth = createAuth(env);
  const authRequest = auth.handleRequest(req);
  const session = await authRequest.validate();
  const reqUrl = new URL(req.url).href;
  if (session) {
    return redirectResponse(reqUrl, res, 302);
  }
  const githubAuth = createGithubAuth(auth, env);
  const [url, state] = await githubAuth.getAuthorizationUrl();
  console.log(`[api] [auth] [login] [github] -> url: ${url}`);

  res.cookie(req, res, env, 'github_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60,
  });
  return redirectResponse(url.href, res, 302);
});

router.get(
  '/github/callback',
  async (req: Request, res: Response, env: Env, ctx: ExecutionContext) => {
    console.log(`[api] [auth] [login] [github]`);
    const auth = createAuth(env);
    const authRequest = auth.handleRequest(req);
    const session = await authRequest.validate();
    if (session) {
      return redirectResponse('/', res, 302);
    }
    const cookies = parseCookie(req.headers.get('cookie') ?? '');
    const storedState = cookies.github_oauth_state;
    const state = req.query?.state;
    const code = req.query?.code;
    // validate state
    if (!storedState || !state || storedState !== state || typeof code !== 'string') {
      return badResponse('Invalid state', undefined, res);
    }
    try {
      const githubAuth = createGithubAuth(auth, env);
      const { getExistingUser, githubUser, createUser } = await githubAuth.validateCallback(code);

      const getUser = async () => {
        const existingUser = await getExistingUser();
        if (existingUser) return existingUser;
        const user = await createUser({
          attributes: {
            username: githubUser.login,
          },
        });
        return user;
      };

      const user = await getUser();
      const session = await auth.createSession({
        userId: user.userId,
        attributes: {},
      });
      authRequest.setSession(session);
      return redirectResponse('/', res, 302);
    } catch (e) {
      if (e instanceof OAuthRequestError) {
        // invalid code
        return badResponse('Invalid code', undefined, res);
      }
      return serverErrorResponse('Server error', new Error(JSON.stringify(e)), res);
    }
  }
);

export default router;
