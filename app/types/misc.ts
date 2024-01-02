import { z } from 'zod'

export const HelloWorldSchema = z.object({
  hello: z.string()
})
export type HelloWorld = z.infer<typeof HelloWorldSchema>

export const MiscDataSchema = z.object({
  data: z.any()
})
export type MiscData = z.infer<typeof MiscDataSchema>

export const MiscDumpSchema = z.object({
  data: z.any(),
  json: z.any().optional(),
  text: z.any().optional()
})
export type MiscDump = z.infer<typeof MiscDumpSchema>

export const TodosSchema = z.object({
  id: z.number(),
  title: z.string(),
  completed: z.boolean()
})
export type Todos = z.infer<typeof TodosSchema>

export const SampleDataSchema = z.object({
  data: z.object({
    id: z.string(),
    type: z.string(),
    attributes: z.object({
      name: z.string(),
      email: z.string(),
      password: z.string()
    })
  })
})
export type SampleData = z.infer<typeof SampleDataSchema>
