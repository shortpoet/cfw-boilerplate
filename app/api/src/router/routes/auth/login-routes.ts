import { IRequest } from 'itty-router';
import { OpenAPIRouter } from '@cloudflare/itty-router-openapi';
import { loginGithub, loginGithubCallback } from '../../../controllers';

type CF = [env: Env, ctx: ExecutionContext];
const router = OpenAPIRouter<IRequest, CF>({ base: '/api/auth/login' });

router.get('/github', async (req: Request, res: Response, env: Env, ctx: ExecutionContext) => {
  req.logger.info(`[api] [auth] [login] [github]`);
  return await loginGithub(req, res, env, ctx);
});

router.get(
  '/github/callback',
  async (req: Request, res: Response, env: Env, ctx: ExecutionContext) => {
    req.logger.info(`[api] [auth] [login] [github] [callback]`);
    return await loginGithubCallback(req, res, env, ctx);
  }
);

export default router;
