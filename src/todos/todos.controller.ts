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
  GetDateTodoDto,
  GetWeeklyTodoDto,
  AddNoteByTaskDto,
} from "./dto";
import { Priority, Status, TaskType } from "./enums";
import { Todo } from "./todos.entity";
import { TodosService } from "./todos.service";
import {
  GetCompletedTaskResponse,
  GetSummaryResponse,
  GetWeeklyTaskResponse,
} from "@todo-app/interfaces";

@Controller("todos")
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  async create(@Body() createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todosService.create(createTodoDto);
  }

  // @Post("completed")
  // async getAllCompletedTasks(
  //   @Body() getDateDto: GetDateTodoDto,
  // ): Promise<GetCompletedTaskResponse[]> {
  //   const task = await this.todosService.getAllCompletedTask(getDateDto);
  //   return task.length !== 0 ? task : [];
  // }

  @Get() //phase 3
  async getAllTask(): Promise<any> {
    return this.todosService.getAllTask();
  }

  @Get("summary") //phase 3
  async getSummary(): Promise<GetSummaryResponse> {
    return this.todosService.getSummary();
  }

  @Get("completed") //phase 3
  async getAllCompletedTasks(): Promise<GetCompletedTaskResponse[]> {
    const task = await this.todosService.getAllCompletedTask();
    return task.length !== 0 ? task : [];
  }

  @Get("backlog") //phase 3
  async getAllBacklogTasks(): Promise<Todo[]> {
    const task = await this.todosService.getAllBacklogTask();
    return task.length !== 0 ? task : [];
  }

  @Get("today/incomplete") //phase 3
  async getAllIncompleteTaskToday(): Promise<Todo[]> {
    return this.todosService.getAllIncompleteTaskToday();
  }

  @Get("today/complete") //phase 3
  async getAllTaskCompletedToday(): Promise<GetCompletedTaskResponse[]> {
    return this.todosService.getAllCompletedTaskToday();
  }

  @Post("addNoteByTask") //phase 3
  async addNoteByTask(@Body() addNoteDto: AddNoteByTaskDto): Promise<Todo> {
    return this.todosService.addNoteByTask(addNoteDto);
  }

  @Post("getByDate")
  async getAllTaskByDate(@Body() getDateDto: GetDateTodoDto): Promise<Todo[]> {
    return this.todosService.getAllTaskByDate(getDateDto);
  }

  @Post("getWeeklyTasks")
  async getAllWeeklyTasks(
    @Body() getWeeklyDto: GetWeeklyTodoDto,
  ): Promise<GetWeeklyTaskResponse> {
    return this.todosService.getWeeklyTasks(getWeeklyDto);
  }

  @Post("summary")
  async getSummaryTask(
    @Body() summaryDto: GetDateTodoDto,
  ): Promise<GetSummaryResponse> {
    return this.todosService.getSummaryTasks(summaryDto);
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

  @Put(":id/importance=:importance")
  async updateTaskImportance(
    @Param("id") id: number,
    @Param("importance") importance: boolean,
  ): Promise<Todo> {
    return this.todosService.updateTaskImportance(id, importance);
  }

  @Delete(":id")
  async remove(@Param("id") id: number): Promise<Todo> {
    return this.todosService.remove(id);
  }
}
