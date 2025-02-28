import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { UserRole } from "./enums";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  @IsString()
  username: string;

  @Column()
  @IsString()
  password: string;

  @Column()
  @IsString()
  firstName: string;

  @Column()
  @IsString()
  @IsOptional()
  middleName: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Column()
  @IsString()
  @IsOptional()
  suffix: string;

  @Column()
  @IsString()
  @IsOptional()
  nickname: string;

  @Column()
  @IsString()
  @IsOptional()
  @MaxLength(12)
  contactNo: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.CLIENT })
  @IsEnum(UserRole)
  userRole: UserRole;

  @Column({ type: "date" })
  birthDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: "boolean", default: false })
  @IsBoolean()
  isActive: Boolean;
}
