import z from 'zod'
import { storeSchema } from '../../types/schemas/store'

const baseStoreInputSchema = storeSchema.omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  owner: true, // Omitimos o objeto 'owner' pois o input será 'ownerId'
})

// DTO para Criação
export const CreateStoreDTOSchema = baseStoreInputSchema.extend({
  // Adiciona a propriedade 'ownerId' para a criação
  ownerId: z.uuid(),
})

// DTO para Atualização
export const UpdateStoreDTOSchema = storeSchema
  .partial() // Deixa todos os campos opcionais
  .required({
    id: true, // Mas o 'id' é obrigatório
  })
  .omit({
    createdAt: true,
    updatedAt: true,
    owner: true, // Omitimos o objeto 'owner'
    // Se você quiser que o 'ownerId' possa ser atualizado, adicione-o aqui com .extend()
  })

// DTO para Mudar o Status
export const ChangeStatusStoreDTOSchema = z.object({
  id: z.uuid(),
  status: z.enum(['OPEN', 'CLOSED', 'IN_MAINTENANCE', 'SUSPENDED']),
})

export type CreateStoreDTO = z.infer<typeof CreateStoreDTOSchema>
export type UpdateStoreDTO = z.infer<typeof UpdateStoreDTOSchema>
export type ChangeStatusStoreDTO = z.infer<typeof ChangeStatusStoreDTOSchema>
