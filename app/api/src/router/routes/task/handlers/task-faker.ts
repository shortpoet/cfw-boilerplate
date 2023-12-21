import { faker } from '@faker-js/faker';
import { TaskComponentType } from '../task-oa';

export const taskFaker = (count: number): TaskComponentType[] => {
  const tasks = Array.from({ length: count }, () => ({
    name: faker.lorem.sentence(),
    slug: faker.lorem.slug(),
    description: faker.lorem.sentence(),
    completed: faker.datatype.boolean(),
    due_date: faker.date.future().toISOString(),
  }));

  return tasks;
};

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
};
