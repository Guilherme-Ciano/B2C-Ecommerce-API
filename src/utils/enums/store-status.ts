import z from 'zod'

export const EStoreStatus = z.enum(['OPEN', 'CLOSED', 'IN_MAINTENANCE', 'SUSPENDED'])
export type StoreStatus = z.infer<typeof EStoreStatus>
