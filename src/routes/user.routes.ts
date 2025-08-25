import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { UserRepository } from '../repositories/user.repository'
import { UserService } from '../services/user.service'
import {
  CreateUserDTOSchema,
  UpdateUserDTOSchema,
  ChangeUserRoleDTOSchema,
} from '../utils/types/dtos/user.dto'
import { LoginUserDTOSchema } from '../utils/types/dtos/login-user.dto'

const userRoutes: FastifyPluginAsyncZod = async (app) => {
  const userRepository = new UserRepository()
  const userService = new UserService(userRepository)

  app.get(
    '/user',
    {
      schema: {
        tags: ['User'],
        querystring: z.object({
          page: z.coerce.number().min(1).default(1),
          limit: z.coerce.number().min(1).max(100).default(10),
        }),
      },
    },
    async (request, reply) => {
      const { page, limit } = request.query
      const result = await userService.getAllUsers(page, limit)
      return reply.code(result.code).send(result)
    },
  )

  app.get(
    '/user/:id',
    {
      schema: {
        tags: ['User'],
        params: z.object({ id: z.string().uuid() }),
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const result = await userService.getById(id)
      return reply.code(result.code).send(result)
    },
  )

  app.post(
    '/user',
    {
      schema: { tags: ['User'], body: CreateUserDTOSchema },
    },
    async (request, reply) => {
      const result = await userService.createUser(request.body)
      return reply.code(result.code).send(result)
    },
  )

  app.put(
    '/user/:id',
    {
      schema: {
        tags: ['User'],
        params: z.object({ id: z.string().uuid() }),
        body: UpdateUserDTOSchema.omit({ id: true }),
      },
    },
    async (request, reply) => {
      const payload = { ...request.body, id: request.params.id }
      const result = await userService.updateUser(payload)
      return reply.code(result.code).send(result)
    },
  )

  app.patch(
    '/user/:id/role',
    {
      schema: {
        tags: ['User'],
        params: z.object({ id: z.string().uuid() }),
        body: ChangeUserRoleDTOSchema.omit({ id: true }),
      },
    },
    async (request, reply) => {
      const payload = { ...request.body, id: request.params.id }
      const result = await userService.changeRoleUser(payload)
      return reply.code(result.code).send(result)
    },
  )

  app.delete(
    '/user/:id',
    {
      schema: { tags: ['User'], params: z.object({ id: z.string().uuid() }) },
    },
    async (request, reply) => {
      const result = await userService.deleteUser(request.params.id)
      return reply.code(result.code).send(result)
    },
  )

  app.post(
    '/user/login',
    {
      schema: { tags: ['User'], body: LoginUserDTOSchema },
    },
    async (request, reply) => {
      const result = await userService.login(request.body)
      return reply.code(result.code).send(result)
    },
  )
}

export default userRoutes
