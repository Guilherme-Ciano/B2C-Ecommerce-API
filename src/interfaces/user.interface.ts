import { Response } from '../utils/types/api'
import {
  ChangeUserRoleDTO,
  CreateUserDTO,
  SafeUserDTO,
  UpdateUserDTO,
} from '../utils/types/dtos/user.dto'
import { User } from '../utils/types/schemas/user'

export interface UserInterface {
  findAll(page: number, limit: number): Promise<Response<SafeUserDTO[]>>
  findById(uuid: string): Promise<Response<SafeUserDTO | undefined>>
  findByEmail(email: string): Promise<Response<User | undefined>>
  createUser(payload: CreateUserDTO): Promise<Response<SafeUserDTO>>
  updateUser(payload: UpdateUserDTO): Promise<Response<SafeUserDTO>>
  changeRoleUser(payload: ChangeUserRoleDTO): Promise<Response<SafeUserDTO>>
  deleteUser(uuid: string): Promise<Response<string | undefined>>
}
