import { IsEnum, IsOptional, IsString } from "class-validator";
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
    default: TaskType.Scheduled,
  })
  @IsEnum(TaskType)
  category: TaskType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  completedAt: Date;
  setStatus(status: Status) {
    if (status === Status.COMPLETED) {
      return (this.completedAt = new Date());
    } else {
      return (this.completedAt = null);
    }
  }
}
