import { FastifyReply, FastifyRequest } from 'fastify'
import { Prisma } from '../../generated/prisma'
import { ZodError } from 'zod'
import { HttpCodes } from '../utils/enums/http-codes'

export function handleAPIErrors(error: any, request: FastifyRequest, reply: FastifyReply) {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      code: HttpCodes.BAD_REQUEST,
      message: 'Validation failed',
      errors: error.issues,
    })
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2000':
        return reply.status(400).send({
          code: HttpCodes.BAD_REQUEST,
          message: `The provided value for a field is invalid or too long.`,
          errors: [
            {
              entity: error?.meta?.modelName,
              message: error?.meta?.cause,
            },
          ],
        })
      case 'P2002':
        return reply.status(409).send({
          code: 409,
          message: `A record with this value already exists.`,
          errors: [
            {
              entity: error?.meta?.modelName,
              message: error?.meta?.cause,
              target: error.meta?.target,
            },
          ],
        })
      case 'P2003':
        return reply.status(400).send({
          code: 400,
          message: `Foreign key constraint failed. The related record does not exist.`,
          errors: [
            {
              entity: error?.meta?.modelName,
              message: error?.meta?.cause,
            },
          ],
        })
      case 'P2011':
        return reply.status(400).send({
          code: 400,
          message: `Null constraint violation. A required field is missing.`,
          errors: [
            {
              entity: error?.meta?.modelName,
              message: error?.meta?.cause,
            },
          ],
        })
      case 'P2025':
        return reply.status(404).send({
          code: 404,
          message: 'The requested record was not found.',
          errors: [
            {
              entity: error?.meta?.modelName,
              message: error?.meta?.cause,
            },
          ],
        })
      default:
        // Lidar com outros erros do Prisma se necessário
        return reply.status(500).send({
          code: 500,
          message: 'An unexpected Prisma error occurred.',
          errors: [error.meta],
        })
    }
  }

  throw error
}
