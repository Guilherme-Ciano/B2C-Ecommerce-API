import { Store } from '../utils/types/schemas/store'
import { Response } from '../utils/types/api'
import { ChangeStatusStoreDTO, CreateStoreDTO, UpdateStoreDTO } from '../utils/types/dtos/store.dto'

export interface StoreInterface {
  findAll(page: number, limit: number): Promise<Response<Store[] | undefined>>
  findById(uuid: string): Promise<Response<Store | undefined>>
  createStore(payload: CreateStoreDTO): Promise<Response<Store | undefined>>
  updateStore(payload: UpdateStoreDTO): Promise<Response<Store | undefined>>
  changeStatusStore(payload: ChangeStatusStoreDTO): Promise<Response<Store | undefined>>
  deleteStore(uuid: string): Promise<Response<string | undefined>>
}
