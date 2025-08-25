import { PrismaClient } from '../../generated/prisma'
import { UserInterface } from '../interfaces/user.interface'
import { userSelect } from '../utils/constants/user.selects'
import { HttpCodes } from '../utils/enums/http-codes'
import {
  formatUser,
  formatUsers,
  formatUserToSafeUser,
  mapCreateDtoToPrisma,
  mapUpdateDtoToPrisma,
} from '../utils/functions/mappers/user.mapper'
import { createMessageFor } from '../utils/functions/messages'
import { User } from '../utils/types/schemas/user'
import { Response } from '../utils/types/api'
import {
  ChangeUserRoleDTO,
  CreateUserDTO,
  SafeUserDTO,
  UpdateUserDTO,
} from '../utils/types/dtos/user.dto'

export class UserRepository implements UserInterface {
  private prisma = new PrismaClient()

  async findAll(page: number, limit: number): Promise<Response<SafeUserDTO[] | undefined>> {
    try {
      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          skip: (page - 1) * limit,
          take: limit,
          select: userSelect,
        }),
        this.prisma.user.count(),
      ])

      const formattedUsers = formatUsers(users)

      return {
        code: HttpCodes.SUCCESS,
        data: formattedUsers,
        meta: {
          limit,
          page,
          totalItems: total,
          totalPages: Math.ceil(total / limit),
        },
        message: createMessageFor('User').SUCCESS.OK,
      }
    } catch (error) {
      console.log(`
        =-=-=-=-=-=-=- ERROR =-=-=-=-=-=-=
        ${error}
        =-=-=-=-=-=-=-       =-=-=-=-=-=-=
        `)

      return {
        code: HttpCodes.INTERNAL_ERROR,
        data: undefined,
        errors: [{ message: 'Internal error while searching for entity' }],
        message: createMessageFor('User').SERVER_ERROR.INTERNAL_SERVER_ERROR,
      }
    }
  }

  async findById(uuid: string): Promise<Response<SafeUserDTO | undefined>> {
    const entity = await this.prisma.user.findUnique({
      where: { id: uuid },
      select: userSelect,
    })

    if (!entity) {
      return {
        code: HttpCodes.NOT_FOUND,
        data: undefined,
        errors: [{ message: 'Entity not found with related id' }],
        message: createMessageFor('User').CLIENT_ERROR.NOT_FOUND,
      }
    }

    return {
      code: HttpCodes.SUCCESS,
      data: formatUser(entity),
      message: createMessageFor('User').SUCCESS.OK,
    }
  }

  async findByEmail(email: string): Promise<Response<User | undefined>> {
    const entity = await this.prisma.user.findUnique({
      where: { email: email },
      select: userSelect,
    })

    if (!entity) {
      return {
        code: HttpCodes.NOT_FOUND,
        data: undefined,
        errors: [{ message: 'Entity not found with related email' }],
        message: createMessageFor('User').CLIENT_ERROR.NOT_FOUND,
      }
    }

    return {
      code: HttpCodes.SUCCESS,
      data: formatUser(entity),
      message: createMessageFor('User').SUCCESS.OK,
    }
  }

  async createUser(payload: CreateUserDTO): Promise<Response<SafeUserDTO | undefined>> {
    try {
      const dataForPrisma = mapCreateDtoToPrisma(payload)

      const rawEntity = await this.prisma.user.create({
        data: {
          ...dataForPrisma,
          passwordHash: payload.passwordHash,
        },
        select: userSelect,
      })

      const formattedEntity = formatUser(rawEntity)

      return {
        code: HttpCodes.SUCCESS,
        data: formattedEntity,
        message: createMessageFor('User').SUCCESS.CREATED,
      }
    } catch (error) {
      console.log(`
        =-=-=-=-=-=-=- ERROR =-=-=-=-=-=-=
        ${error}
        =-=-=-=-=-=-=-       =-=-=-=-=-=-=
        `)

      return {
        code: HttpCodes.INTERNAL_ERROR,
        data: undefined,
        errors: [{ message: 'Internal error while creating store' }],
        message: createMessageFor('User').SERVER_ERROR.INTERNAL_SERVER_ERROR,
      }
    }
  }

  async updateUser(payload: UpdateUserDTO): Promise<Response<SafeUserDTO | undefined>> {
    try {
      const { id, data: updateData } = mapUpdateDtoToPrisma(payload)

      const response = await this.prisma.user.update({
        where: { id },
        data: updateData,
        select: userSelect,
      })

      const data = formatUser(response)

      return {
        code: HttpCodes.SUCCESS,
        data,
        message: createMessageFor('User').SUCCESS.UPDATED,
      }
    } catch (error) {
      console.log(`
        =-=-=-=-=-=-=- ERROR =-=-=-=-=-=-=
        ${error}
        =-=-=-=-=-=-=-       =-=-=-=-=-=-=
        `)

      return {
        code: HttpCodes.NOT_FOUND,
        data: undefined,
        errors: [{ message: 'Entity not found with related id' }],
        message: createMessageFor('User').CLIENT_ERROR.NOT_FOUND,
      }
    }
  }

  async changeRoleUser(payload: ChangeUserRoleDTO): Promise<Response<SafeUserDTO | undefined>> {
    try {
      const response = await this.prisma.user.update({
        where: { id: payload.id },
        data: { role: payload.role },
        select: userSelect,
      })

      const data = formatUser(response)

      return {
        code: HttpCodes.SUCCESS,
        data,
        message: createMessageFor('User').SUCCESS.UPDATED,
      }
    } catch (error) {
      console.log(`
        =-=-=-=-=-=-=- ERROR =-=-=-=-=-=-=
        ${error}
        =-=-=-=-=-=-=-       =-=-=-=-=-=-=
        `)

      return {
        code: HttpCodes.NOT_FOUND,
        data: undefined,
        errors: [{ message: 'Entity not found with related id' }],
        message: createMessageFor('Store').CLIENT_ERROR.NOT_FOUND,
      }
    }
  }

  async deleteUser(uuid: string): Promise<Response<string | undefined>> {
    try {
      await this.prisma.user.delete({ where: { id: uuid } })
      return {
        code: HttpCodes.SUCCESS,
        data: uuid,
        message: createMessageFor('User').SUCCESS.DELETED,
      }
    } catch (error: any) {
      console.log(`
        =-=-=-=-=-=-=- ERROR =-=-=-=-=-=-=
        ${error}
        =-=-=-=-=-=-=-       =-=-=-=-=-=-=
        `)

      return {
        code: HttpCodes.NOT_FOUND,
        data: undefined,
        errors: [{ message: 'Entity not found with related id' }],
        message: createMessageFor('User').CLIENT_ERROR.NOT_FOUND,
      }
    }
  }
}
