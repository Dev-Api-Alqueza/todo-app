import { IsNumber, IsOptional, IsString } from "class-validator";
import { Todo } from "../../todos/todos.entity";

type PickedTodo = Pick<Todo, "setStatusCompleted" | "setStatusInProgress">;

export interface GetCompletedTaskResponse extends PickedTodo {
  effortBurn: number;
}

export class CreateTaskNoteDto {
  @IsString()
  createdAt: Date;
  @IsString()
  content: string;
}

export class GetTaskNoteDto {
  @IsString()
  date: Date;
}
export class UpdateNoteDto extends GetTaskNoteDto {
  @IsString()
  content: string;
}
