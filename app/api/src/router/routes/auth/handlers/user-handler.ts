import { q } from '#/api/db'
import { notFoundResponse, jsonOkResponse, badResponse } from '#/api/src/middleware'
import { OpenAPIRoute, OpenAPIRouteSchema } from '@cloudflare/itty-router-openapi'
import { GetUsersSchema } from '../auth-schema'

export class GetUsers extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = GetUsersSchema

  async handle(
    req: Request,
    res: Response,
    env: Env,
    ctx: ExecutionContext,
    data: Record<string, any>
  ) {
    try {
      const result = await q.getAllUsers()
      if (!result) {
        return notFoundResponse('User not found')
      }
      return jsonOkResponse(result, res)
    } catch (error) {
      console.error(error)
      return badResponse('Error getting user', error, res)
    }
  }
}

// export class Me extends OpenAPIRoute {
//   static schema = MeSchema;

//   async handle(req: RequestWithDB) {
//     const user = await Users.getById(Number(req.user_id));
//     return json(UserComponent.parse(user));
//   }
// }
