import { z } from 'zod'
type User = {
  id: number
  name: string
  age: number
}

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  age: z.number()
}) satisfies z.ZodType<User>
