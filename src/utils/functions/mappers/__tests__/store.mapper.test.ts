import { formatStore, formatStores, mapCreateDtoToPrisma } from '../store.mapper'
import { CreateStoreDTO } from '../../../types/dtos/store.dto'
import { Store as FormattedStore } from '../../../types/schemas/store'

describe('Store Mappers', () => {
  // Mock data representing a store object returned directly from a Prisma query
  const mockPrismaStore = {
    id: 'store-uuid-1',
    name: 'Tech Haven',
    status: 'ACTIVE',
    owner: {
      id: 'owner-uuid-1',
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
    },
    category: 'ELECTRONICS',
    email: 'contact@techhaven.com',
    description: 'A store for all your tech needs.',
    phone: '11987654321',
    website: 'www.techhaven.com',
    cnpj: '12.345.678/0001-90',
    ie: '987.654.321.123',
    logoUrl: 'http://example.com/logo.png',
    bannerUrl: 'http://example.com/banner.png',
    createdAt: new Date(),
    updatedAt: new Date(),
    addressStreet: '123 Tech Avenue',
    addressNumber: '10',
    addressNeighborhood: 'Silicon Valley',
    addressCity: 'Techville',
    addressState: 'TS',
    addressZipCode: '12345-000',
    addressCountry: 'USA',
    addressComplement: 'Suite 200',
  }

  // Mock data representing the input DTO for creating a new store
  const mockCreateDto: CreateStoreDTO = {
    ownerId: 'owner-uuid-1',
    name: 'Brand New Store',
    category: 'FASHION',
    email: 'new@store.com',
    description: 'High-end fashion.',
    phone: '11999999999',
    website: 'www.newstore.com',
    cnpj: '11.111.111/0001-11',
    ie: '111.111.111.111',
    logoUrl: 'http://newstore.com/logo.png',
    bannerUrl: 'http://newstore.com/banner.png',
    address: {
      street: '456 Fashion Blvd',
      number: '50',
      neighborhood: 'Fashion District',
      city: 'Style City',
      state: 'ST',
      zipCode: '54321-000',
      country: 'USA',
      complement: 'Building A',
    },
  }

  // --- Tests for formatStore ---
  describe('formatStore', () => {
    it('should correctly map a full Prisma store object to the application format', () => {
      const formattedStore = formatStore(mockPrismaStore)

      expect(formattedStore).toEqual({
        ...mockPrismaStore,
        address: {
          street: mockPrismaStore.addressStreet,
          number: mockPrismaStore.addressNumber,
          neighborhood: mockPrismaStore.addressNeighborhood,
          city: mockPrismaStore.addressCity,
          state: mockPrismaStore.addressState,
          zipCode: mockPrismaStore.addressZipCode,
          country: mockPrismaStore.addressCountry,
          complement: mockPrismaStore.addressComplement,
        },
        addressStreet: undefined,
        addressNumber: undefined,
        addressNeighborhood: undefined,
        addressCity: undefined,
        addressState: undefined,
        addressZipCode: undefined,
        addressCountry: undefined,
        addressComplement: undefined,
      })
      // Ensure the address fields are correctly nested and the flat fields are removed from the root
      expect(formattedStore.address).toBeDefined()
    })

    it('should correctly handle undefined optional fields', () => {
      const mockPrismaStoreWithoutOptionalFields = {
        ...mockPrismaStore,
        description: null,
        website: null,
        logoUrl: null,
        bannerUrl: null,
        addressComplement: null,
      }

      const formattedStore = formatStore(mockPrismaStoreWithoutOptionalFields)

      expect(formattedStore.description).toBeUndefined()
      expect(formattedStore.website).toBeUndefined()
      expect(formattedStore.logoUrl).toBeUndefined()
      expect(formattedStore.bannerUrl).toBeUndefined()
      expect(formattedStore.address.complement).toBeUndefined()
    })
  })

  // --- Tests for formatStores ---
  describe('formatStores', () => {
    it('should correctly map an array of Prisma stores', () => {
      const storesArray = [mockPrismaStore, mockPrismaStore]
      const formattedStores = formatStores(storesArray)

      expect(formattedStores).toHaveLength(2)
      expect(formattedStores[0]).toEqual(formatStore(mockPrismaStore))
      expect(formattedStores[1]).toEqual(formatStore(mockPrismaStore))
    })

    it('should return an empty array for an empty input array', () => {
      const formattedStores = formatStores([])
      expect(formattedStores).toEqual([])
    })
  })

  // --- Tests for mapCreateDtoToPrisma ---
  describe('mapCreateDtoToPrisma', () => {
    it('should correctly map the DTO to the Prisma create format', () => {
      const prismaPayload = mapCreateDtoToPrisma(mockCreateDto)

      expect(prismaPayload.owner).toEqual({
        connect: {
          id: mockCreateDto.ownerId,
        },
      })
      expect(prismaPayload.name).toBe(mockCreateDto.name)
      expect(prismaPayload.addressStreet).toBe(mockCreateDto.address.street)
      expect(prismaPayload.addressComplement).toBe(mockCreateDto.address.complement)
    })

    it('should handle optional address fields correctly', () => {
      const dtoWithOptionalFields: CreateStoreDTO = {
        ...mockCreateDto,
        address: {
          ...mockCreateDto.address,
          complement: undefined,
        },
        description: undefined,
      }

      const prismaPayload = mapCreateDtoToPrisma(dtoWithOptionalFields)

      expect(prismaPayload.addressComplement).toBeUndefined()
      expect(prismaPayload.description).toBeUndefined()
    })
  })
})
