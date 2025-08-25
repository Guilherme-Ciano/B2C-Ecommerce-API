import z from 'zod'

export const EProductStatus = z.enum(['NEW', 'AVAILABLE', 'OUT_OF_STOCK', 'PROMO'])
export type ProductStatus = z.infer<typeof EProductStatus>
