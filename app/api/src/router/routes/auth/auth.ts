import { IRequest } from 'itty-router';
import { OpenAPIRouter } from '@cloudflare/itty-router-openapi';
import { getUsersFind } from '../../../controllers';
import { createAuth, jsonOkResponse, createGithubAuth } from '../../../middleware';
import redirect from '#/api/src/middleware/redirect';
import { OAuthRequestError } from '@lucia-auth/oauth';
import { parseCookie } from 'lucia/dist/utils/cookie';

type CF = [env: Env, ctx: ExecutionContext];
const router = OpenAPIRouter<IRequest, CF>({ base: '/api/login' });

router.get(
  '/login/github',
  async (req: Request, res: Response, env: Env, ctx: ExecutionContext) => {
    console.log(`[api] [auth] [login] [github]`);
    const auth = createAuth(env);
    const authRequest = auth.handleRequest(req);
    const session = await authRequest.validate();
    if (session) {
      return redirect.fetch(req, env, ctx);
    }
    const githubAuth = createGithubAuth(auth, env);
    const [url, state] = await githubAuth.getAuthorizationUrl();

    res.cookie('github_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60,
    });
    return res.status(302).setHeader('Location', url.toString()).end();
  }
);

router.get(
  '/login/github/callback',
  async (req: Request, res: Response, env: Env, ctx: ExecutionContext) => {
    console.log(`[api] [auth] [login] [github]`);
    const authRequest = auth.handleRequest(req, res);
    const session = await authRequest.validate();
    if (session) {
      return res.status(302).setHeader('Location', '/').end();
    }
    const cookies = parseCookie(req.headers.cookie ?? '');
    const storedState = cookies.github_oauth_state;
    const state = req.query.state;
    const code = req.query.code;
    // validate state
    if (!storedState || !state || storedState !== state || typeof code !== 'string') {
      return res.sendStatus(400);
    }
    try {
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
      return res.status(302).setHeader('Location', '/').end();
    } catch (e) {
      if (e instanceof OAuthRequestError) {
        // invalid code
        return res.sendStatus(400);
      }
      return res.sendStatus(500);
    }
  }
);

export default router;
