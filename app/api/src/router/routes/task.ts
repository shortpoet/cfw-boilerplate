import { IRequest } from 'itty-router';
import { OpenAPIRouter } from '@cloudflare/itty-router-openapi';

import { TaskList } from '@/api/src/controllers';
import { TaskCreate } from '@/api/src/controllers';
import { TaskFetch } from '@/api/src/controllers';
import { TaskDelete } from '@/api/src/controllers';
// router.get('/api/tasks/', TaskList);
// router.post('/api/tasks/', TaskCreate);
// router.get('/api/tasks/:taskSlug/', TaskFetch);
// router.delete('/api/tasks/:taskSlug/', TaskDelete);

type CF = [env: Env, ctx: ExecutionContext];
const router = OpenAPIRouter<IRequest, CF>({ base: '/api/' });

// router.get('/tasks', TaskList);

export default router;
