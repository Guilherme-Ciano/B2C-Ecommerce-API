import { z } from 'zod'

export const userSchema = z.object({
  id: z.uuid(),
  name: z.string().min(3).max(150),
  email: z.email(),
  passwordHash: z.string(),
  phone: z.string(),

  // Endereço do usuário
  address: z.object({
    street: z.string(),
    number: z.string(),
    complement: z.string().optional(),
    neighborhood: z.string(),
    city: z.string(),
    state: z.string().max(2),
    zipCode: z.string().max(15),
    country: z.string().default('BR'),
  }),

  // Se ele tiver uma loja vinculada
  storeId: z.uuid().optional(),

  // Roles no sistema
  role: z.enum(['CUSTOMER', 'SELLER', 'ADMIN']).default('CUSTOMER'),

  createdAt: z.coerce.date().default(() => new Date()),
  updatedAt: z.coerce.date().default(() => new Date()),
})

export type User = z.infer<typeof userSchema>
