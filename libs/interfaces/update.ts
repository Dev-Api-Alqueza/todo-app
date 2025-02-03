import { Priority } from "../../src/todos/enums/priority";
import { Status } from "../../src/todos/enums/status";

export interface UpdatePriorityResponse {
  id: number;
  priority: Priority;
}

export interface UpdateStatusResponse {
  id: number;
  status: Status;
}

export interface UpdateTaskTypeResponse {
  id: number;
  isScheduled: boolean;
}
