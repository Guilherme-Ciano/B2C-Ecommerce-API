import { z } from 'zod'
import { EStoreStatus } from '../../enums/store-status'
import { ECategory } from '../../enums/category'
import { ownerSchema } from './owner'

export const storeSchema = z.object({
  id: z.uuid(),
  name: z.string().min(3).max(100).trim(),
  description: z.string().max(2000).optional(),
  status: EStoreStatus.default('OPEN'),
  owner: ownerSchema,
  category: ECategory.transform((c) => c.toUpperCase()),

  // Informações de contato
  email: z.email(),
  phone: z.string().min(8).max(20),
  website: z.url().optional(),

  // Endereço da loja
  address: z.object({
    street: z.string(),
    number: z.string(),
    complement: z.string().optional(),
    neighborhood: z.string(),
    city: z.string(),
    state: z.string().max(2), // sigla tipo "SP"
    zipCode: z.string().max(15),
    country: z.string().default('BR'),
  }),

  // Dados fiscais (Brasil-friendly)
  cnpj: z.string().length(14),
  ie: z.string().default('SP'), // inscrição estadual

  // Configurações da loja
  logoUrl: z.url().optional(),
  bannerUrl: z.url().optional(),

  // Dados de criação
  createdAt: z.coerce.date().default(() => new Date()),
  updatedAt: z.coerce.date().default(() => new Date()),
})

export type Store = z.infer<typeof storeSchema>
