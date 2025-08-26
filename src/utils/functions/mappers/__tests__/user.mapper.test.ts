import {
  formatUser,
  formatUsers,
  formatUserToSafeUser,
  mapCreateDtoToPrisma,
  mapUpdateDtoToPrisma,
  handlePrismaError,
  formatSafeUsers,
} from '../user.mapper'
import { CreateUserDTO, UpdateUserDTO, SafeUserDTO } from '../../../types/dtos/user.dto'
import { Prisma } from '../../../../../generated/prisma'
import { userSelect } from '../../../constants/user.selects'
import { HttpCodes } from '../../../enums/http-codes'

type PrismaUserResult = Prisma.UserGetPayload<{ select: typeof userSelect }>

describe('User Mappers and Utilities', () => {
  const mockPrismaUser: PrismaUserResult = {
    id: 'user-uuid-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    passwordHash: 'hashedpassword123',
    phone: '11987654321',
    role: 'CUSTOMER',
    addressStreet: 'Main Street',
    addressNumber: '123',
    addressComplement: 'Apt 1',
    addressNeighborhood: 'Downtown',
    addressCity: 'Metropolis',
    addressState: 'NY',
    addressZipCode: '12345-678',
    addressCountry: 'USA',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockPrismaSafeUser = {
    id: 'user-uuid-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '11987654321',
    role: 'CUSTOMER',
    addressStreet: 'Main Street',
    addressNumber: '123',
    addressComplement: 'Apt 1',
    addressNeighborhood: 'Downtown',
    addressCity: 'Metropolis',
    addressState: 'NY',
    addressZipCode: '12345-678',
    addressCountry: 'USA',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockPrismaUserWithoutAddress = {
    id: 'user-uuid-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    passwordHash: 'hashedpassword123',
    phone: '11987654321',
    role: 'CUSTOMER',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockCreateDto: CreateUserDTO = {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    passwordHash: 'hashedpassword456',
    phone: '11998765432',
    address: {
      street: 'Test Street',
      number: '456',
      complement: 'Suite B',
      neighborhood: 'Test',
      city: 'Test City',
      state: 'TS',
      zipCode: '00000-000',
      country: 'Test Country',
    },
  }

  // --- Testes para formatUser ---
  describe('formatUser', () => {
    it('should correctly format a full Prisma user object', () => {
      const formattedUser = formatUser(mockPrismaUser)
      expect(formattedUser).toEqual({
        ...mockPrismaUserWithoutAddress,
        address: {
          street: 'Main Street',
          number: '123',
          complement: 'Apt 1',
          neighborhood: 'Downtown',
          city: 'Metropolis',
          state: 'NY',
          zipCode: '12345-678',
          country: 'USA',
        },
      })
    })

    it('should correctly handle null addressComplement', () => {
      const userWithNullAddress: PrismaUserResult = {
        ...mockPrismaUser,
        addressComplement: null,
      }
      const formattedUser = formatUser(userWithNullAddress)
      expect(formattedUser.address.complement).toBeUndefined()
    })
  })

  // --- Testes para formatUserToSafeUser ---
  describe('formatUserToSafeUser', () => {
    it('should correctly format a user object without sensitive data', () => {
      const safeUser = formatUserToSafeUser(mockPrismaUser)
      expect(safeUser).toEqual(
        expect.objectContaining({
          id: mockPrismaUser.id,
          name: mockPrismaUser.name,
          email: mockPrismaUser.email,
          phone: mockPrismaUser.phone,
          role: mockPrismaUser.role,
          createdAt: mockPrismaUser.createdAt,
          updatedAt: mockPrismaUser.updatedAt,
          address: expect.any(Object),
        }),
      )
      expect((safeUser as any).passwordHash).toBeUndefined()
    })
  })

  // --- Testes para formatUsers ---
  describe('formatUsers', () => {
    it('should correctly format an array of Prisma users', () => {
      const usersArray = [mockPrismaUser, mockPrismaUser]
      const formattedUsers = formatSafeUsers(usersArray)
      expect(formattedUsers).toHaveLength(2)
      expect(formattedUsers[0]).toEqual(formatUserToSafeUser(mockPrismaUser))
      expect(formattedUsers[1]).toEqual(formatUserToSafeUser(mockPrismaUser))
    })

    it('should return an empty array for an empty input', () => {
      const formattedUsers = formatUsers([])
      expect(formattedUsers).toEqual([])
    })
  })

  // --- Testes para mapCreateDtoToPrisma ---
  describe('mapCreateDtoToPrisma', () => {
    it('should correctly map a create DTO to the Prisma format', () => {
      const prismaPayload = mapCreateDtoToPrisma(mockCreateDto)
      expect(prismaPayload).toEqual({
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        passwordHash: 'hashedpassword456',
        phone: '11998765432',
        addressStreet: 'Test Street',
        addressNumber: '456',
        addressComplement: 'Suite B',
        addressNeighborhood: 'Test',
        addressCity: 'Test City',
        addressState: 'TS',
        addressZipCode: '00000-000',
        addressCountry: 'Test Country',
      })
    })
  })

  // --- Testes para mapUpdateDtoToPrisma ---
  describe('mapUpdateDtoToPrisma', () => {
    it('should correctly map an update DTO with address fields', () => {
      const updatePayload: UpdateUserDTO = {
        id: 'user-uuid-1',
        name: 'Updated Name',
        address: {
          street: 'New Street',
          number: '456',
          city: 'Test city',
          country: 'Test country',
          neighborhood: 'Test neighborhood',
          complement: 'Test complement',
          state: 'Test',
          zipCode: 'Ts',
        },
      }
      const mappedResult = mapUpdateDtoToPrisma(updatePayload)
      expect(mappedResult.id).toBe('user-uuid-1')
      expect(mappedResult.data).toEqual({
        addressCity: 'Test city',
        addressCountry: 'Test country',
        addressNeighborhood: 'Test neighborhood',
        addressNumber: '456',
        addressState: 'Test',
        addressStreet: 'New Street',
        addressZipCode: 'Ts',
        addressComplement: 'Test complement',
        name: 'Updated Name',
      })
    })

    it('should correctly map a payload without an address field', () => {
      const updatePayload: UpdateUserDTO = {
        id: 'user-uuid-1',
        name: 'Updated Name Only',
      }
      const mappedResult = mapUpdateDtoToPrisma(updatePayload)
      expect(mappedResult.id).toBe('user-uuid-1')
      expect(mappedResult.data).toEqual({
        name: 'Updated Name Only',
      })
    })
  })

  // --- Testes para handlePrismaError ---
  describe('handlePrismaError', () => {
    it('should return a success response on a successful call', async () => {
      const mockResult = { id: 'success-id', name: 'Success' }
      const prismaPromise = Promise.resolve(mockResult)
      const result = await handlePrismaError(prismaPromise)
      expect(result.code).toBe(HttpCodes.SUCCESS)
      expect(result.data).toEqual(mockResult)
    })

    it('should return a 404 response for a P2025 error', async () => {
      const prismaPromise = Promise.reject({
        code: 'P2025',
        meta: { cause: 'Record not found' },
      })
      const result = await handlePrismaError(prismaPromise)
      expect(result.code).toBe(HttpCodes.NOT_FOUND)
      expect(result.data).toBeUndefined()
      expect(result.message).toContain('not found')
    })

    it('should re-throw an unknown error', async () => {
      const unknownError = new Error('Unknown error')
      const prismaPromise = Promise.reject(unknownError)
      await expect(handlePrismaError(prismaPromise)).rejects.toThrow(unknownError)
    })
  })
})
