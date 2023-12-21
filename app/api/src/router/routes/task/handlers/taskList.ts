import { Task } from './types';
import { OpenAPIRoute, OpenAPIRouteSchema, Query } from '@cloudflare/itty-router-openapi';
import { GetTaskSchema } from '../task-oa';
import { taskFaker } from './task-faker';

export class TaskList extends OpenAPIRoute {
  static schema = GetTaskSchema;

  async handle(
    req: Request,
    res: Response,
    env: Env,
    ctx: ExecutionContext,
    data: Record<string, any>
  ) {
    // Retrieve the validated parameters
    const { page, isCompleted } = data.query;

    // Implement your own object list here

    return {
      success: true,
      page,
      isCompleted,
      tasks: [
        {
          name: 'Clean my room',
          slug: 'clean-room',
          description: null,
          completed: false,
          due_date: '2025-01-05',
        },
        {
          name: 'Build something awesome with Cloudflare Workers',
          slug: 'cloudflare-workers',
          description: 'Lorem Ipsum',
          completed: true,
          due_date: '2022-12-24',
        },
        ...taskFaker(24),
      ],
    };
  }
}
