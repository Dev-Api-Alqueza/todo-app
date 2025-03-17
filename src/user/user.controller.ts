import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.entity";
import { DisableUserResponse } from "../../libs/interfaces";
import { ChangePasswordDto, LoginDto, UserDto } from "./dto";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
  async createUser(@Body() registerDto: UserDto): Promise<User> {
    return this.userService.createUser(registerDto);
  }

  @Post("login")
  async loginUser(@Body() loginDto: LoginDto): Promise<User> {
    return this.userService.loginUser(loginDto);
  }

  @Get("list")
  async getUserList(): Promise<User[]> {
    return this.userService.getUserList();
  }

  @Put("update/:id/:status")
  async updateUserStatus(
    @Param("id") id: number,
    @Param("status") status: boolean,
  ): Promise<DisableUserResponse> {
    return this.userService.updateUserStatus(id, status);
  }

  @Put("update/:id")
  async updateUser(
    @Param("id") id: number,
    @Body() updateDto: UserDto,
  ): Promise<User> {
    return this.userService.updateUser(id, updateDto);
  }

  @Post("change-password")
  async changePassword(@Body() changepassDto: ChangePasswordDto) {
    return this.userService.updatePassword(changepassDto);
  }

  @Put("reset-password/:id")
  async resetPassword(@Param("id") id: number): Promise<User> {
    return this.userService.resetPassword(id);
  }
}
