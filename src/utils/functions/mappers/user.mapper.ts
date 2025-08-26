import { Prisma } from '../../../../generated/prisma'
import { userSelect } from '../../constants/user.selects'
import { HttpCodes } from '../../enums/http-codes'
import { createMessageFor } from '../messages'
import { User } from '../../types/schemas/user'
import { Response } from '../../types/api'
import { CreateUserDTO, SafeUserDTO, UpdateUserDTO } from '../../types/dtos/user.dto'

type PrismaUserResult = Prisma.UserGetPayload<{ select: typeof userSelect }>

export const formatUser = (user: PrismaUserResult): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  passwordHash: user.passwordHash,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  address: {
    street: user.addressStreet,
    number: user.addressNumber,
    complement: user.addressComplement ?? undefined,
    neighborhood: user.addressNeighborhood,
    city: user.addressCity,
    state: user.addressState,
    zipCode: user.addressZipCode,
    country: user.addressCountry,
  },
})

export const formatUserToSafeUser = (user: PrismaUserResult): SafeUserDTO => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  address: {
    street: user.addressStreet,
    number: user.addressNumber,
    complement: user.addressComplement ?? undefined,
    neighborhood: user.addressNeighborhood,
    city: user.addressCity,
    state: user.addressState,
    zipCode: user.addressZipCode,
    country: user.addressCountry,
  },
})

export const formatUsers = (users: PrismaUserResult[]): User[] => {
  return users.map(formatUser)
}

export const formatSafeUsers = (users: PrismaUserResult[]): SafeUserDTO[] => {
  return users.map(formatUserToSafeUser)
}

export const mapCreateDtoToPrisma = (payload: CreateUserDTO) => {
  const { address, ...restOfUserData } = payload
  return {
    ...restOfUserData,
    addressStreet: address?.street,
    addressNumber: address?.number,
    addressComplement: address?.complement,
    addressNeighborhood: address?.neighborhood,
    addressCity: address?.city,
    addressState: address?.state,
    addressZipCode: address?.zipCode,
    addressCountry: address?.country,
  }
}

export const mapUpdateDtoToPrisma = (payload: UpdateUserDTO) => {
  const { id, address, ...restOfUserData } = payload
  const prismaData: any = { ...restOfUserData }

  if (address) {
    prismaData.addressStreet = address.street
    prismaData.addressNumber = address.number
    prismaData.addressComplement = address.complement
    prismaData.addressNeighborhood = address.neighborhood
    prismaData.addressCity = address.city
    prismaData.addressState = address.state
    prismaData.addressZipCode = address.zipCode
    prismaData.addressCountry = address.country
  }

  return { id, data: prismaData }
}

export const handlePrismaError = async <T>(
  prismaCall: Promise<T>,
): Promise<Response<T | undefined>> => {
  try {
    const data = await prismaCall

    return {
      code: HttpCodes.SUCCESS,
      data: data,
      message: createMessageFor('User').SUCCESS.OK,
    }
  } catch (error: any) {
    if (error.code === 'P2025') {
      return {
        code: HttpCodes.NOT_FOUND,
        data: undefined,
        errors: [{ message: 'Entity not found with related id' }],
        message: createMessageFor('User').CLIENT_ERROR.NOT_FOUND,
      }
    }
    throw error
  }
}
