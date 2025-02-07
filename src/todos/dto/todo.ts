import {
  IsBoolean,
  IsDate,
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
  category?: TaskType = TaskType.SCHEDULED;

  @IsString()
  createdAt: Date;
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
  @IsBoolean()
  importance?: boolean;

  @IsOptional()
  completedAt?: Date;
}

export class GetDateTodoDto {
  @IsString()
  date: string;
  @IsOptional()
  @IsEnum(TaskType)
  category: TaskType = TaskType.SCHEDULED;
}

export class GetWeeklyTodoDto {
  @IsEnum(TaskType)
  category: TaskType = TaskType.SCHEDULED;
}
