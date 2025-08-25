import { StoreInterface } from '../interfaces/store.interface'
import { Store } from '../utils/types/schemas/store'
import { Response } from '../utils/types/api'
import { ChangeStatusStoreDTO, CreateStoreDTO, UpdateStoreDTO } from '../utils/types/dtos/store.dto'

export class StoreService {
  constructor(private readonly storeInterface: StoreInterface) {}

  public async getAllStores(page: number, limit: number): Promise<Response<Store[] | undefined>> {
    return this.storeInterface.findAll(page, limit)
  }

  public async getById(uuid: string): Promise<Response<Store | undefined>> {
    return this.storeInterface.findById(uuid)
  }

  public async createStore(payload: CreateStoreDTO): Promise<Response<Store | undefined>> {
    return this.storeInterface.createStore(payload)
  }

  public async updateStore(payload: UpdateStoreDTO): Promise<Response<Store | undefined>> {
    return this.storeInterface.updateStore(payload)
  }

  public async changeStatusStore(
    payload: ChangeStatusStoreDTO,
  ): Promise<Response<Store | undefined>> {
    return this.storeInterface.changeStatusStore(payload)
  }

  public async deleteStore(uuid: string): Promise<Response<string | undefined>> {
    return this.storeInterface.deleteStore(uuid)
  }
}
