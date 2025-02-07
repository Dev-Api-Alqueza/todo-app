import { Todo } from "../../src/todos/todos.entity";

type OmittedTodo = Omit<Todo, "setStatusCompleted" | "setStatusInProgress">;

export interface GetCompletedTaskResponse extends OmittedTodo {
  effortBurn: number;
}

interface WeeklyCount {
  completed?: string;
  incomplete?: string;
}
export interface GetWeeklyTaskResponse {
  Monday?: WeeklyCount;
  Tuesday?: WeeklyCount;
  Wednesday?: WeeklyCount;
  Thursday?: WeeklyCount;
  Friday?: WeeklyCount;
  Saturday?: WeeklyCount;
  Sunday?: WeeklyCount;
}
export interface GetSummaryResponse {
  completed: string;
  inprogress: string;
  todo: string;
}
