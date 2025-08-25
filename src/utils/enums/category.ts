import z from 'zod'

export const ECategory = z.enum(['FOOD', 'TECH', 'BOOKS', 'ART', 'SERVICES'])
export type Category = z.infer<typeof ECategory>
