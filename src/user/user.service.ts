import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Put,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { DisableUserResponse } from "@todo-app/interfaces";
import { LoginDto, UserDto } from "./dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findId(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { userId: id } });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (err) {
      throw err;
    }
  }

  async findUsername(username: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { username } });
      console.log(user);
      if (user) {
        throw new ConflictException(
          `User with username ${username} already exist`,
        );
      }
      return user;
    } catch (err) {
      throw err;
    }
  }

  async createUser(registerDto: UserDto): Promise<User> {
    await this.findUsername(registerDto.username);
    try {
      const user = await this.userRepository.save(registerDto);
      return user;
    } catch (err) {
      throw err;
    }
  }

  async loginUser(loginDto: LoginDto): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { ...loginDto },
      });
      if (!user) {
        throw new NotFoundException(`Incorrect Username or Password`);
      }
      if (user.isActive === false) {
        throw new ForbiddenException(
          `User is inactive please contact admin to activate.`,
        );
      }
      return user;
    } catch (err) {
      throw err;
    }
  }

  async getUserList(): Promise<User[]> {
    try {
      const list = await this.userRepository.find();
      return list;
    } catch (err) {
      throw err;
    }
  }

  async updateUserStatus(
    id: number,
    status: boolean,
  ): Promise<DisableUserResponse> {
    await this.findId(id);
    try {
      const updateUser = {
        userId: id,
        isActive: status,
      };
      const updates = await this.userRepository.update(id, updateUser);
      return updates as any as DisableUserResponse;
    } catch (err) {
      throw err;
    }
  }

  async updateUser(id: number, updateDto: UserDto): Promise<User> {
    try {
      await this.findId(id);
      const user = await this.userRepository.update(id, updateDto);
      return user as any as User;
    } catch (err) {
      throw err;
    }
  }
}
