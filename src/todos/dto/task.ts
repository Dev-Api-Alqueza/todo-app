import { IsNumber, IsOptional, IsString } from "class-validator";
import { Todo } from "../todos.entity";

type PickedTodo = Pick<Todo, "setStatusCompleted" | "setStatusInProgress">;

export interface GetCompletedTaskResponse extends PickedTodo {
  effortBurn: number;
}

export class TaskNoteDto {
  @IsNumber()
  id: number;
  @IsString()
  createdAt: Date;
  @IsOptional()
  @IsString()
  content: string;
}
