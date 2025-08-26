import { PrismaClient } from '../../generated/prisma'
import { storeSelect } from '../utils/constants/store.selects'
import { HttpCodes } from '../utils/enums/http-codes'
import { createMessageFor } from '../utils/functions/messages'
import { Store } from '../utils/types/schemas/store'
import { Response } from '../utils/types/api'
import { CreateStoreDTO, ChangeStatusStoreDTO, UpdateStoreDTO } from '../utils/types/dtos/store.dto'

import {
  formatStore,
  formatStores,
  mapCreateDtoToPrisma,
} from '../utils/functions/mappers/store.mapper'
import { StoreInterface } from '../interfaces/store.interface'

export class StoreRepository implements StoreInterface {
  private prisma = new PrismaClient()

  async findAll(page: number, limit: number): Promise<Response<Store[]>> {
    const [data, total] = await Promise.all([
      this.prisma.store.findMany({
        skip: (page - 1) * limit,
        take: limit,
        select: storeSelect,
      }),
      this.prisma.store.count(),
    ])

    const response = formatStores(data)

    return {
      code: HttpCodes.SUCCESS,
      data: response,
      meta: {
        limit,
        page,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
      message: createMessageFor('Store').SUCCESS.OK,
    }
  }

  async findById(uuid: string): Promise<Response<Store | undefined>> {
    const entity = await this.prisma.store.findUnique({ where: { id: uuid } })

    if (!entity) {
      return {
        code: HttpCodes.NOT_FOUND,
        data: undefined,
        errors: [{ message: 'Entity not found with related id' }],
        message: createMessageFor('Store').CLIENT_ERROR.NOT_FOUND,
      }
    }

    return {
      code: HttpCodes.SUCCESS,
      data: formatStore(entity),
      message: createMessageFor('Store').SUCCESS.OK,
    }
  }

  async createStore(payload: CreateStoreDTO): Promise<Response<Store>> {
    const dataForPrisma = mapCreateDtoToPrisma(payload)

    const rawEntity = await this.prisma.store.create({
      data: dataForPrisma,
      select: storeSelect,
    })

    const formattedEntity = formatStore(rawEntity)

    return {
      code: HttpCodes.SUCCESS,
      data: formattedEntity,
      message: createMessageFor('Store').SUCCESS.CREATED,
    }
  }

  async updateStore(payload: UpdateStoreDTO): Promise<Response<Store>> {
    const { id, address, ...restOfUpdateData } = payload

    const mappedAddressData = {
      addressStreet: address?.street,
      addressNumber: address?.number,
      addressComplement: address?.complement,
      addressNeighborhood: address?.neighborhood,
      addressCity: address?.city,
      addressState: address?.state,
      addressZipCode: address?.zipCode,
      addressCountry: address?.country,
    }

    const updatedEntity = await this.prisma.store.update({
      where: { id },
      data: {
        ...restOfUpdateData,
        ...mappedAddressData,
      },
      select: storeSelect,
    })

    const data = formatStore(updatedEntity)

    return {
      code: HttpCodes.SUCCESS,
      data,
      message: createMessageFor('Store').SUCCESS.UPDATED,
    }
  }

  async changeStatusStore(payload: ChangeStatusStoreDTO): Promise<Response<Store>> {
    const updatedEntity = await this.prisma.store.update({
      where: { id: payload.id },
      data: { status: payload.status },
      select: storeSelect,
    })

    const data = formatStore(updatedEntity)

    return {
      code: HttpCodes.SUCCESS,
      data,
      message: createMessageFor('Store').SUCCESS.UPDATED,
    }
  }

  async deleteStore(uuid: string): Promise<Response<string>> {
    await this.prisma.store.delete({ where: { id: uuid } })
    return {
      code: HttpCodes.SUCCESS,
      data: uuid,
      message: createMessageFor('Store').SUCCESS.DELETED,
    }
  }
}
