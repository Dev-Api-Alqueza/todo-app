import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import { Priority, Status, TaskType } from "../enums";
class BaseDto {
  @IsNumber()
  id: number;
}

export class CreateTodoDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority = Priority.HIGH;

  @IsOptional()
  @IsEnum(Status)
  status?: Status = Status.TODO;

  @IsOptional()
  @IsEnum(TaskType)
  category?: TaskType = TaskType.Scheduled;
}

export class UpdateTodoDto extends BaseDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsEnum(TaskType)
  category?: TaskType;

  @IsOptional()
  completedAt?: Date;
}
