import { q } from '#/api/db'
import { notFoundResponse, jsonOkResponse, badResponse } from '#/api/src/middleware'

export const getUsersFind = async (
  req: Request,
  response: Response,
  env: Env,
  context: ExecutionContext
) => {
  try {
    const result = await q.getAllUsers()
    if (!result) {
      return notFoundResponse('User not found')
    }
    return jsonOkResponse(result, response)
  } catch (error) {
    console.error(error)
    return badResponse('Error getting user', error, response)
  }
}
