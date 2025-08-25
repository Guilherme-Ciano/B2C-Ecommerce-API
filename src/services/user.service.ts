import bcrypt from 'bcryptjs'
import { Response } from '../utils/types/api'
import {
  ChangeUserRoleDTO,
  CreateUserDTO,
  SafeUserDTO,
  UpdateUserDTO,
} from '../utils/types/dtos/user.dto'
import { HttpCodes } from '../utils/enums/http-codes'
import { createMessageFor } from '../utils/functions/messages'
import { LoginUserDTO } from '../utils/types/dtos/login-user.dto'
import { UserInterface } from '../interfaces/user.interface'
import { formatUserToSafeUser } from '../utils/functions/mappers/user.mapper'

export class UserService {
  constructor(private readonly userInterface: UserInterface) {}

  async getAllUsers(page: number, limit: number): Promise<Response<SafeUserDTO[] | undefined>> {
    return this.userInterface.findAll(page, limit)
  }

  async getById(id: string): Promise<Response<SafeUserDTO | undefined>> {
    return this.userInterface.findById(id)
  }

  async createUser(payload: CreateUserDTO): Promise<Response<SafeUserDTO | undefined>> {
    const { passwordHash, email, ...restOfPayload } = payload

    const existingUser = await this.userInterface.findByEmail(email)
    if (existingUser.data) {
      return {
        code: HttpCodes.BAD_REQUEST,
        errors: [{ message: 'Email already exists' }],
        message: createMessageFor('User').CLIENT_ERROR.BAD_REQUEST,
        data: undefined,
      }
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(passwordHash, salt)

    const userPayload = {
      ...restOfPayload,
      email,
      passwordHash: hashedPassword,
    } as CreateUserDTO

    return this.userInterface.createUser(userPayload)
  }

  async updateUser(payload: UpdateUserDTO): Promise<Response<SafeUserDTO | undefined>> {
    return this.userInterface.updateUser(payload)
  }

  async changeRoleUser(payload: ChangeUserRoleDTO): Promise<Response<SafeUserDTO | undefined>> {
    return this.userInterface.changeRoleUser(payload)
  }

  async deleteUser(id: string): Promise<Response<string | undefined>> {
    return this.userInterface.deleteUser(id)
  }

  async login(payload: LoginUserDTO): Promise<Response<SafeUserDTO | undefined>> {
    const { email, password } = payload

    const userResponse = await this.userInterface.findByEmail(email)

    if (!userResponse.data) {
      return {
        code: HttpCodes.UNAUTHORIZED,
        data: undefined,
        errors: [{ message: 'Invalid credentials' }],
        message: 'Unauthorized',
      }
    }

    const user = userResponse.data
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

    if (!isPasswordValid) {
      return {
        code: HttpCodes.UNAUTHORIZED,
        data: undefined,
        errors: [{ message: 'Invalid credentials' }],
        message: 'Unauthorized',
      }
    }

    return {
      code: HttpCodes.SUCCESS,
      data: user,
      message: 'Login successfully!',
    }
  }
}
