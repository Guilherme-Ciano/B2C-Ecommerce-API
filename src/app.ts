import Fastify from 'fastify'

import cors from './utils/plugins/cors'
import security from './utils/plugins/security'
import sensible from './utils/plugins/sensible'
import healthRoutes from './routes/health.routes'
import storeRoutes from './routes/store.routes'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import userRoutes from './routes/user.routes'
import { handleAPIErrors } from './middlewares/error-handling'

export function buildApp() {
  const app = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>()

  app.setErrorHandler(handleAPIErrors)

  app.register(cors)
  app.register(security)
  app.register(sensible)

  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'ecommerce-marketplace',
        description: 'Documentação da API utilizando Fastify, Prisma e Docker',
        version: '1.0.0',
      },
    },
    // Importante adicionar para fazer o parse do schema
    transform: jsonSchemaTransform,
  })

  app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
  })

  app.register(healthRoutes, { prefix: '/v1' })
  app.register(storeRoutes, { prefix: '/api' })
  app.register(userRoutes, { prefix: '/api' })

  return app
}
