import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import {
  CreateTodoDto,
  UpdateTodoDto,
  UpdateTaskModalDto,
  GetDateTodoDto,
} from "./dto";
import { Priority, Status, TaskType } from "./enums";
import { Todo } from "./todos.entity";
import { TodosService } from "./todos.service";
import {
  UpdatePriorityResponse,
  UpdateStatusResponse,
  UpdateTaskTypeResponse,
  GetCompletedTaskResponse,
} from "@todo-app/interfaces";

@Controller("todos")
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  async create(@Body() createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todosService.create(createTodoDto);
  }

  @Post("completed")
  async getAllCompletedTasks(
    @Body() getDateDto: GetDateTodoDto,
  ): Promise<GetCompletedTaskResponse[]> {
    const task = await this.todosService.getAllCompletedTask(getDateDto.date);
    return task.length !== 0 ? task : [];
  }

  @Post("getByDate")
  async getAllTaskByDate(@Body() getDateDto: GetDateTodoDto): Promise<Todo[]> {
    return this.todosService.getAllTaskByDate(getDateDto.date);
  }

  @Get()
  async getAllTask(): Promise<Todo[]> {
    return this.todosService.getAllTask();
  }

  @Get()
  async findAll(@Query("priority") priority?: Priority): Promise<Todo[]> {
    if (priority) {
      return this.todosService.getFilteredTodos(priority);
    }
    return this.todosService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: number): Promise<Todo> {
    return this.todosService.findOne(id);
  }

  @Put("update")
  async updateTaskModal(
    @Body() updateTaskModalDto: UpdateTodoDto,
  ): Promise<Todo> {
    return this.todosService.updateModalTask(updateTaskModalDto);
  }

  @Put(":id/status=:status")
  async updateTaskByStatus(
    @Param("id") id: number,
    @Param("status") status: Status,
  ): Promise<Todo> {
    return this.todosService.updateTaskByStatus(id, status);
  }

  @Put(":id/priority=:priority")
  async updateTaskByPriority(
    @Param("id") id: number,
    @Param("priority") priority: Priority,
  ): Promise<Todo> {
    return this.todosService.updateTaskByPriority(id, priority);
  }

  @Put(":id/type=:type")
  async updateTaskByType(
    @Param("id") id: number,
    @Param("type") type: TaskType,
  ): Promise<Todo> {
    return this.todosService.updateTaskByType(id, type);
  }

  @Delete(":id")
  async remove(@Param("id") id: number): Promise<Todo> {
    return this.todosService.remove(id);
  }
}
