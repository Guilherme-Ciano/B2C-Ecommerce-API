import z from 'zod'
import { ECategory } from '../../enums/category'
import { EProductStatus } from '../../enums/product-status'

export const productSchema = z.object({
  id: z.uuid(),
  name: z.string().min(3).max(100).trim(),
  description: z.string().max(2000).optional(),
  price: z.number(),
  status: EProductStatus.transform((c) => c.toUpperCase()),
  category: ECategory.transform((c) => c.toUpperCase()),
  createdAt: z.coerce.date().default(() => new Date()),
  updatedAt: z.coerce.date().default(() => new Date()),
})
