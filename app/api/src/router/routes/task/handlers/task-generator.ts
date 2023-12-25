import {
  randVerb,
  randAccessory,
  randLine,
  randCatchPhrase,
  randText,
  randProductAdjective,
  randProductMaterial,
  randProductDescription,
  randProductName,
  randBoolean,
  randSoonDate
} from '@ngneat/falso'
import { TaskComponentType } from '../task-component'
import { capitalize } from 'lodash-es'

const base: TaskComponentType[] = [
  {
    id: '1',
    name: 'Clean my room',
    slug: 'clean-room',
    description: undefined,
    completed: false,
    due_date: '2025-01-05'
  },
  {
    id: '2',
    name: 'Build something awesome with Cloudflare Workers',
    slug: 'cloudflare-workers',
    description: 'Lorem Ipsum',
    completed: true,
    due_date: '2022-12-24'
  }
]

export const taskGenerator = (count: number): TaskComponentType[] => {
  let id = 3
  const tasks = base.concat(
    Array.from({ length: count }, () => {
      const verb = randVerb()
      const slug = randProductName()
      const name = `${capitalize(verb)} ${slug}`
      return {
        id: `${id++}`,
        name,
        slug,
        description: `${capitalize(
          verb
        )} ${randProductAdjective()} ${slug} - ${randProductDescription()}`,
        completed: randBoolean(),
        due_date: randSoonDate().toISOString()
      }
    })
  )

  return tasks
}

export const taskFakerBatch = async (req: Request, res: Response) => {
  // const { page = 1 } = req.query;
  // const limit = 10;
  // const offset = (page - 1) * limit;
  // const tasks = Array.from({ length: limit }, () => ({
  //   id: faker.datatype.uuid(),
  //   title: faker.lorem.sentence(),
  //   description: faker.lorem.paragraph(),
  //   completed: faker.datatype.boolean(),
  //   createdAt: faker.date.past(),
  //   updatedAt: faker.date.past(),
  // }));
  // const total = 100;
  // const totalPages = Math.ceil(total / limit);
  // const prevPage = page > 1 ? page - 1 : null;
  // const nextPage = page < totalPages ? page + 1 : null;
  // res.status(200).json({
  //   tasks,
  //   total,
  //   totalPages,
  //   prevPage,
  //   nextPage,
  // });
}
