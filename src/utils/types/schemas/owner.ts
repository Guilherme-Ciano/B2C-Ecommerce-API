import z from 'zod'

export const ownerSchema = z.object({
  id: z.uuid(),
  name: z.string().min(3).max(100).trim(),
})

export type Owner = z.infer<typeof ownerSchema>
