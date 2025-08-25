import { HttpCodes } from '../enums/http-codes'

interface Error {
  message: string
  field?: string
}

interface Pagination {
  totalItems: number
  page: number
  limit: number
  totalPages: number
}

interface Response<T> {
  code: HttpCodes
  data: T
  meta?: Pagination
  errors?: Error[]
  message?: string
}

export { Error, Response, Pagination }
