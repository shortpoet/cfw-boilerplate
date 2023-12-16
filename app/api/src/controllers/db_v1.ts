import { q } from '#/api/db/d1-kysely-authjs';
import { uuidv4 } from '#/utils';
import { jsonOkResponse, notFoundResponse } from '../middleware';

export const getUsersFind = async (
  req: Request,
  response: Response,
  env: Env,
  context: ExecutionContext
) => {
  const result = await q.getAllUsers(env);
  if (!result) {
    return notFoundResponse('User not found');
  }
  return jsonOkResponse(result, response);
};
