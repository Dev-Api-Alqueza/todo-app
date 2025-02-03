import { TaskType } from "src/todos/enums/taskType";

export const isEmpty = (value: string) => {
  return !value ? true : false;
};
export const isZeroOrNull = (value: number) => {
  return value == 0 || value == null ? true : false;
};

export const isScheduled = (value: string) => {
  return value == TaskType.Scheduled ? true : false;
};
