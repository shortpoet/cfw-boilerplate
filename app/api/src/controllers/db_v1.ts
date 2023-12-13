import { q } from '@cfw-boilerplate/db/src';
import { uuidv4 } from '@cfw-boilerplate/utils';

export const getUsersFind = async (
  req: Request,
  response: Response,
  env: Env,
  context: ExecutionContext
) => {
  const result = await q.getAllUsers(env);
  if (!result) {
    return new Response('No value found', {
      status: 404,
    });
  }
  return new Response(JSON.stringify(result), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
