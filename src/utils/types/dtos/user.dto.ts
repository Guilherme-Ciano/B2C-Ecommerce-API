import z from 'zod'
import { userSchema } from '../schemas/user'

export const CreateUserDTOSchema = userSchema.omit({
  id: true,
  role: true,
  createdAt: true,
  updatedAt: true,
})

export const UpdateUserDTOSchema = userSchema
  .partial()
  .required({
    id: true,
  })
  .omit({
    createdAt: true,
    updatedAt: true,
  })

export const ChangeUserRoleDTOSchema = z.object({
  id: z.uuid(),
  role: z.enum(['CUSTOMER', 'SELLER', 'ADMIN']),
})

export const SafeUserDTOSchema = userSchema.omit({
  passwordHash: true,
})

export type CreateUserDTO = z.infer<typeof CreateUserDTOSchema>
export type UpdateUserDTO = z.infer<typeof UpdateUserDTOSchema>
export type ChangeUserRoleDTO = z.infer<typeof ChangeUserRoleDTOSchema>
export type SafeUserDTO = z.infer<typeof SafeUserDTOSchema>
