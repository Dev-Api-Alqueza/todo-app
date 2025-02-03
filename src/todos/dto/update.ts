import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import { Status } from "../enums/status";
import { Priority } from "../enums/priority";
import { TaskType } from "../enums/taskType";

class BaseDto {
  @IsNumber()
  id: number;
}
export class UpdateTaskDto extends BaseDto {
  @IsOptional()
  @IsEnum(Status)
  status: Status;
  @IsOptional()
  @IsEnum(Status)
  priority: Priority;
  @IsOptional()
  @IsBoolean()
  isScheduled: boolean;
  @IsOptional()
  completedAt: Date;
}

export class UpdateTaskModalDto extends BaseDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskType)
  category?: TaskType;
}

export class UpdateTaskModal {
  title: string;
  description: string;
  isScheduled: boolean;
}
