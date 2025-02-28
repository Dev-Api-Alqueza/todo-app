import { IsEnum, IsOptional, IsString, MinLength } from "class-validator";
import { UserRole } from "../enums";

export class UserDto {
  @IsString()
  username: string;
  @IsString()
  @MinLength(8)
  password: string;
  @IsString()
  firstName: string;
  @IsString()
  @IsOptional()
  middleName: string;
  @IsString()
  lastName: string;
  @IsString()
  @IsOptional()
  suffix: string;
  @IsString()
  @IsOptional()
  nickname: string;
  @IsString()
  @IsOptional()
  contactNo: string;
  @IsEnum(UserRole)
  @IsOptional()
  userRole: UserRole;
  @IsString()
  birthDate: string;
}

export class LoginDto {
  @IsString()
  username: string;
  @IsString()
  password: string;
}
