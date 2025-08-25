import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { StoreService } from '../services/store.service'
import { StoreRepository } from '../repositories/store.repository'
import {
  ChangeStatusStoreDTOSchema,
  CreateStoreDTOSchema,
  UpdateStoreDTOSchema,
} from '../utils/types/dtos/store.dto'
import { z } from 'zod'

const storeRoutes: FastifyPluginAsyncZod = async (app) => {
  const storeRepository = new StoreRepository()
  const storeService = new StoreService(storeRepository)

  app.get(
    '/store',
    {
      schema: {
        tags: ['Store'],
        querystring: z.object({
          page: z.coerce.number().min(1).default(1),
          limit: z.coerce.number().min(1).max(100).default(10),
        }),
      },
    },
    async (request, reply) => {
      const { page, limit } = request.query
      const result = await storeService.getAllStores(page, limit)
      return reply.code(result.code).send(result)
    },
  )

  app.get(
    '/store/:id',
    {
      schema: {
        tags: ['Store'],
        params: z.object({ id: z.uuid() }),
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const result = await storeService.getById(id)
      return reply.code(result.code).send(result)
    },
  )

  app.post(
    '/store',
    {
      schema: { tags: ['Store'], body: CreateStoreDTOSchema },
    },
    async (request, reply) => {
      const result = await storeService.createStore(request.body)
      return reply.code(result.code).send(result)
    },
  )

  app.put(
    '/store/:id',
    {
      schema: {
        tags: ['Store'],
        params: z.object({ id: z.uuid() }),
        body: UpdateStoreDTOSchema,
      },
    },
    async (request, reply) => {
      const payload = { ...request.body, id: request.params.id }
      const result = await storeService.updateStore(payload)
      return reply.code(result.code).send(result)
    },
  )

  app.patch(
    '/store/:id/status',
    {
      schema: {
        tags: ['Store'],
        params: z.object({ id: z.uuid() }),
        body: ChangeStatusStoreDTOSchema.omit({ id: true }),
      },
    },
    async (request, reply) => {
      const payload = {
        ...request.body,
        id: request.params.id,
      }
      const result = await storeService.changeStatusStore(payload)
      return reply.code(result.code).send(result)
    },
  )

  app.delete(
    '/store/:id',
    {
      schema: { tags: ['Store'], params: z.object({ id: z.uuid() }) },
    },
    async (request, reply) => {
      const result = await storeService.deleteStore(request.params.id)
      return reply.code(result.code).send(result)
    },
  )
}

export default storeRoutes
