import { PrismaClient, User as PrismaUser } from '../../../generated/prisma'
import { UserRepository } from '../user.repository'
import { CreateUserDTO, UpdateUserDTO, ChangeUserRoleDTO } from '../../utils/types/dtos/user.dto'
import { User as FormattedUser } from '../../utils/types/schemas/user'
import { HttpCodes } from '../../utils/enums/http-codes'

// Mock the entire PrismaClient module
const mPrismaClient = {
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}
jest.mock('../../../generated/prisma', () => {
  return { PrismaClient: jest.fn(() => mPrismaClient) }
})

describe('UserRepository', () => {
  let userRepository: UserRepository
  let prisma: PrismaClient

  // Mock data for Prisma (flat address fields)
  const mockPrismaUser: PrismaUser = {
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

  // Mock data for the formatted output (nested address object)
  const mockFormattedUser: FormattedUser = {
    id: 'user-uuid-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    passwordHash: 'hashedpassword123',
    phone: '11987654321',
    role: 'CUSTOMER',
    storeId: undefined,
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
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    prisma = new PrismaClient()
    userRepository = new UserRepository()
  })

  // --- Tests for findAll ---
  describe('findAll', () => {
    it('should return a paginated list of users', async () => {
      ;(prisma.user.findMany as jest.Mock).mockResolvedValue([mockPrismaUser])
      ;(prisma.user.count as jest.Mock).mockResolvedValue(1)

      const result = await userRepository.findAll(1, 10)

      expect(prisma.user.count).toHaveBeenCalledTimes(1)
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        select: expect.any(Object),
      })
      expect(result.data).toEqual([mockFormattedUser])
      expect(result.meta?.totalItems).toBe(1)
    })
  })

  // --- Tests for findById ---
  describe('findById', () => {
    it('should return a user when found', async () => {
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockPrismaUser)

      const result = await userRepository.findById('user-uuid-1')

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-uuid-1' },
        select: expect.any(Object),
      })
      expect(result.data).toEqual(mockFormattedUser)
    })

    it('should return undefined when user is not found', async () => {
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

      const result = await userRepository.findById('non-existent-uuid')

      expect(result.data).toBeUndefined()
    })
  })

  // --- Tests for findByEmail ---
  describe('findByEmail', () => {
    it('should return a user when found by email', async () => {
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockPrismaUser)

      const result = await userRepository.findByEmail('john.doe@example.com')

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'john.doe@example.com' },
        select: expect.any(Object),
      })
      expect(result.data).toEqual(mockFormattedUser)
    })

    it('should return undefined when user is not found by email', async () => {
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

      const result = await userRepository.findByEmail('non-existent@example.com')

      expect(result.data).toBeUndefined()
    })
  })

  // --- Tests for createUser ---
  describe('createUser', () => {
    it('should create a new user and return the formatted user', async () => {
      const createPayload: CreateUserDTO = {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        passwordHash: 'hashedpassword456',
        phone: '11998765432',
        address: {
          street: 'Test Street',
          number: '456',
          neighborhood: 'Test',
          city: 'Test City',
          state: 'TS',
          zipCode: '00000-000',
          country: 'Test Country',
        },
      }

      ;(prisma.user.create as jest.Mock).mockResolvedValue(mockPrismaUser)

      const result = await userRepository.createUser(createPayload)

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          ...createPayload,
          addressStreet: createPayload.address?.street,
          addressNumber: createPayload.address?.number,
          addressComplement: createPayload.address?.complement,
          addressNeighborhood: createPayload.address?.neighborhood,
          addressCity: createPayload.address?.city,
          addressState: createPayload.address?.state,
          addressZipCode: createPayload.address?.zipCode,
          addressCountry: createPayload.address?.country,
          address: undefined, // Prisma expects flat fields, so the nested object must be removed
        },
        select: expect.any(Object),
      })
      expect(result.data).toEqual(mockFormattedUser)
    })
  })

  // --- Tests for updateUser ---
  describe('updateUser', () => {
    it('should update a user and return the formatted data', async () => {
      const updatePayload: UpdateUserDTO = {
        id: 'user-uuid-1',
        name: 'Updated Name',
        phone: '99999999999',
      }

      const updatedUser = { ...mockPrismaUser, name: 'Updated Name', phone: '99999999999' }
      ;(prisma.user.update as jest.Mock).mockResolvedValue(updatedUser)

      const result = await userRepository.updateUser(updatePayload)

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: updatePayload.id },
        data: {
          name: updatePayload.name,
          phone: updatePayload.phone,
        },
        select: expect.any(Object),
      })
      expect(result.data).toEqual(
        expect.objectContaining({
          name: 'Updated Name',
          phone: '99999999999',
        }),
      )
    })
  })

  // --- Tests for changeRoleUser ---
  describe('changeRoleUser', () => {
    it('should change the user role and return the formatted data', async () => {
      const rolePayload: ChangeUserRoleDTO = {
        id: 'user-uuid-1',
        role: 'ADMIN',
      }
      const updatedUser = { ...mockPrismaUser, role: 'ADMIN' }
      ;(prisma.user.update as jest.Mock).mockResolvedValue(updatedUser)

      const result = await userRepository.changeRoleUser(rolePayload)

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: rolePayload.id },
        data: { role: 'ADMIN' },
        select: expect.any(Object),
      })
      expect(result.data?.role).toBe('ADMIN')
    })
  })

  // --- Tests for deleteUser ---
  describe('deleteUser', () => {
    it('should delete a user and return their id', async () => {
      // This test case is already correct
      ;(prisma.user.delete as jest.Mock).mockResolvedValue(mockPrismaUser)

      const result = await userRepository.deleteUser('user-uuid-1')

      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: 'user-uuid-1' },
      })
      expect(result.data).toBe('user-uuid-1')
    })

    // Corrected test case for the error scenario
    it('should return 404 for a non-existent user', async () => {
      // We mock the Prisma call to reject with a Prisma error object
      ;(prisma.user.delete as jest.Mock).mockRejectedValue({
        code: 'P2025',
        meta: { cause: 'Record not found.' },
      })

      // We now expect the function to return a Response object with the 404 code
      const result = await userRepository.deleteUser('non-existent-uuid')

      expect(result.data).toBeUndefined()
      expect(result.code).toBe(HttpCodes.NOT_FOUND)
    })
  })
})
