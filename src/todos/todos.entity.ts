import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Priority, Status, TaskType } from "./enums";

@Entity("users_tasks")
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  title: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Column({
    type: "enum",
    enum: Priority,
    default: Priority.HIGH,
  })
  @IsEnum(Priority)
  priority: Priority;

  @Column({
    type: "enum",
    enum: Status,
    default: Status.TODO,
  })
  @IsEnum(Status)
  status: Status;

  @Column({
    type: "enum",
    enum: TaskType,
    default: TaskType.SCHEDULED,
  })
  @IsEnum(TaskType)
  category: TaskType;

  @Column({
    type: "boolean",
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  importance?: boolean;

  @Column()
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;
  setStatusInProgress(status: Status) {
    return status === Status.IN_PROGRESS
      ? (this.updatedAt = new Date())
      : (this.updatedAt = this.updatedAt);
  }

  @Column({ type: "timestamp", nullable: true })
  completedAt: Date;
  setStatusCompleted(status: Status) {
    return status === Status.COMPLETED
      ? (this.completedAt = new Date())
      : (this.completedAt = null);
  }
}
