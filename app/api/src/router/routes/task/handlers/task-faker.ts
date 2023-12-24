import { faker } from '@faker-js/faker'
import { TaskComponentType } from '../task-oa'
import { capitalize } from 'lodash-es'

export const taskFaker = (count: number): TaskComponentType[] => {
  let id = 2
  const tasks = Array.from({ length: count }, () => {
    const name = `${capitalize(faker.word.verb())} ${faker.commerce.productName()}`
    return {
      id: `${id++}`,
      name,
      slug: faker.commerce.product(),
      description: `${name} ${faker.word.verb()} ${faker.commerce.productAdjective()} ${faker.commerce.productMaterial()}}`,
      completed: faker.datatype.boolean(),
      due_date: faker.date.future().toISOString()
    }
  })

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
