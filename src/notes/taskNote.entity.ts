import { IsOptional, IsString } from "class-validator";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("task_notes")
export class TaskNote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @IsOptional()
  @IsString()
  content?: string;
}
