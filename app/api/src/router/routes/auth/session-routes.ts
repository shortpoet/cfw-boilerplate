import { IRequest } from 'itty-router';
import { OpenAPIRouter } from '@cloudflare/itty-router-openapi';
import { loginGithub, loginGithubCallback } from '../../../controllers';
import { createAuth, jsonOkResponse } from '#/api/src/middleware';

type CF = [env: Env, ctx: ExecutionContext];
const router = OpenAPIRouter<IRequest, CF>({ base: '/api/auth/session' });

router.get('/', async (req: Request, res: Response, env: Env, ctx: ExecutionContext) => {
  console.log(`[api] [auth] [login] [github]`);
  const { auth } = await createAuth(env);
  const authRequest = auth.handleRequest(req);
  const session = await authRequest.validate();
  return jsonOkResponse(session, res);
});

export default router;
