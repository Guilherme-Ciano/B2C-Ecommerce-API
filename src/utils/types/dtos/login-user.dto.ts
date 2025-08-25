import z from 'zod'

export const LoginUserDTOSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})

export type LoginUserDTO = z.infer<typeof LoginUserDTOSchema>
