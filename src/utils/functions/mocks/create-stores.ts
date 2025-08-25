import { v4 as uuidv4 } from 'uuid'
import { Store } from '../schemas/store'
import { EStoreStatus } from '../../enums/store-status'
import { ECategory } from '../../enums/category'

/**
 * Generates a list of mock stores.
 * @param count The number of stores to generate.
 * @returns An array of mock Store objects.
 */
export function generateMockStores(count: number): Store[] {
  const stores: Store[] = []
  for (let i = 0; i < count; i++) {
    stores.push({
      id: uuidv4(),
      name: `Store ${i + 1}`,
      owner: {
        id: uuidv4(),
        name: `Owner ${i + 1}`,
      },
      category: ECategory.enum.BOOKS,
      status: EStoreStatus.enum.OPEN,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }
  return stores
}
