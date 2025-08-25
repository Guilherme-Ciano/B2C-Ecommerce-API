import { Response } from '../utils/types/api'
import {
  ChangeUserRoleDTO,
  CreateUserDTO,
  SafeUserDTO,
  UpdateUserDTO,
} from '../utils/types/dtos/user.dto'
import { User } from '../utils/types/schemas/user'

export interface UserInterface {
  findAll(page: number, limit: number): Promise<Response<SafeUserDTO[] | undefined>>
  findById(uuid: string): Promise<Response<SafeUserDTO | undefined>>
  findByEmail(email: string): Promise<Response<User | undefined>>
  createUser(payload: CreateUserDTO): Promise<Response<SafeUserDTO | undefined>>
  updateUser(payload: UpdateUserDTO): Promise<Response<SafeUserDTO | undefined>>
  changeRoleUser(payload: ChangeUserRoleDTO): Promise<Response<SafeUserDTO | undefined>>
  deleteUser(uuid: string): Promise<Response<string | undefined>>
}
