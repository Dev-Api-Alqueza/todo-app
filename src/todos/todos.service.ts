// todos/todos.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  GetCompletedTaskResponse,
  GetSummaryResponse,
  GetWeeklyTaskResponse,
} from "@todo-app/interfaces";
import { effortBurnComputation } from "@todo-app/utilities";
import { Repository } from "typeorm";
import {
  CreateTodoDto,
  UpdateTodoDto,
  GetDateTodoDto,
  GetWeeklyTodoDto,
} from "./dto";
import { Priority, Status, TaskType } from "./enums";
import { Todo } from "./todos.entity";
import { DayOfTheWeek } from "@todo-app/constants";

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todosRepository: Repository<Todo>,
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    try {
      const newTodo = await this.todosRepository.create(createTodoDto);

      return await this.todosRepository.save(newTodo);
    } catch (err) {
      throw err;
    }
  }

  async findAll(): Promise<Todo[]> {
    try {
      const resData = await this.todosRepository.find();

      return resData;
    } catch (err) {
      throw err;
    }
  }

  async findOne(id: number): Promise<Todo> {
    const todo = await this.todosRepository.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  async getAllTask(): Promise<Todo[]> {
    try {
      const tasks = await this.todosRepository.find({
        order: { completedAt: "ASC", priority: "ASC", createdAt: "ASC" },
      });

      return tasks;
    } catch (err) {
      throw err;
    }
  }

  async getAllTaskByDate(getTaskDto: GetDateTodoDto): Promise<Todo[]> {
    try {
      const tasks = await this.todosRepository
        .createQueryBuilder("users_tasks")
        .where(`Date(createdAt) = :created AND category = :category`, {
          created: getTaskDto.date,
          category: getTaskDto.category,
        })
        .orderBy("category", "ASC")
        .addOrderBy("priority", "ASC")
        .getMany();
      return tasks;
    } catch (err) {
      throw err;
    }
  }

  async getWeeklyTasks(
    getWeekly: GetWeeklyTodoDto,
  ): Promise<GetWeeklyTaskResponse> {
    try {
      interface TaskQueryResponse {
        day_of_week: string;
        completed_count: string;
        incomplete_count: string;
      }

      const tasks = (await this.todosRepository
        .createQueryBuilder("users_tasks")
        .select(
          `DAYNAME(createdAt) AS day_of_week, 
          COUNT(CASE WHEN STATUS = 'completed' THEN 1 END) AS completed_count,
          COUNT(CASE WHEN STATUS != 'completed' THEN 1 END) AS incomplete_count`,
        )
        .where(
          `category = :category AND createdAt BETWEEN DATE_SUB(CURRENT_DATE, INTERVAL (DAYOFWEEK(CURRENT_DATE)-1) DAY)
          AND DATE_ADD(CURRENT_DATE, INTERVAL (8 - DAYOFWEEK(CURRENT_DATE)) DAY)
          GROUP BY DAYOFWEEK(createdAt) 
          ORDER BY FIELD(DAYOFWEEK(createdAt), 2, 3, 4, 5, 6, 7, 1);`,
          { ...getWeekly },
        )
        .execute()) as TaskQueryResponse[];

      const result = DayOfTheWeek.reduce((acc, day) => {
        const dayData = tasks.find((item) => item.day_of_week === day);
        acc[day] = {
          complete: dayData ? dayData.completed_count : "0",
          incomplete: dayData ? dayData.incomplete_count : "0",
        };
        return acc;
      }, {});

      return result;
    } catch (err) {
      throw err;
    }
  }

  async getSummaryTasks(
    summaryDto: GetDateTodoDto,
  ): Promise<GetSummaryResponse> {
    try {
      interface Summary {
        completed_count: string;
        inprogress_count: string;
        todo_count: string;
      }
      const tasks = await this.todosRepository
        .createQueryBuilder("users_tasks")
        .select(
          `COUNT(CASE WHEN STATUS = 'completed' THEN 1 END) AS completed_count,
	      COUNT(CASE WHEN STATUS = 'in_progress' THEN 1 END) AS inprogress_count,
        COUNT(CASE WHEN STATUS = 'todo' THEN 1 END) AS todo_count`,
        )
        .where("Date(createdAt) = :created", { created: summaryDto.date })
        .execute();
      const result = tasks.map((x: Summary) => ({
        completed: x.completed_count,
        inprogress: x.inprogress_count,
        todo: x.todo_count,
      }));
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getFilteredTodos(priority: Priority): Promise<Todo[]> {
    try {
      const todos = await this.todosRepository.find({
        where: { priority },
        order: { createdAt: "ASC" },
      });

      return todos;
    } catch (err) {
      throw err;
    }
  }

  async getAllCompletedTask(
    getTaskDto: GetDateTodoDto,
  ): Promise<GetCompletedTaskResponse[]> {
    const tasks = await this.todosRepository
      .createQueryBuilder("users_tasks")
      .where(
        `status = :status AND DATE(completedAt) = :completed AND category = :category`,
        {
          status: Status.COMPLETED,
          completed: getTaskDto.date,
          category: getTaskDto.category,
        },
      )
      .orderBy("category", "ASC")
      .addOrderBy("priority", "ASC")
      .getMany();
    const filteredTask = tasks.map((item) => ({
      ...item,
      effortBurn: effortBurnComputation(item.updatedAt, item.completedAt),
    }));

    return filteredTask;
  }

  async updateModalTask(updatePayload: UpdateTodoDto): Promise<Todo> {
    const { id } = await this.findOne(updatePayload.id);

    const updatedTask = {
      title: updatePayload.title,
      category: updatePayload.category,
      description: updatePayload.description,
    };

    try {
      const updatedTasks = await this.todosRepository.update(id, updatedTask);

      return updatedTasks as any as Todo;
    } catch (err) {
      throw err;
    }
  }

  async updateTaskByStatus(id: number, status: Status): Promise<Todo> {
    const task = await this.findOne(id);
    const completion = task.setStatusCompleted(status);
    const updated = task.setStatusInProgress(status);
    const updatedTaskStatus = {
      id,
      status,
      updatedAt: updated,
      completedAt: completion,
    } as UpdateTodoDto;

    try {
      const updates = await this.todosRepository.update(id, updatedTaskStatus);

      return updates as any as Todo;
    } catch (err) {
      throw err;
    }
  }

  async updateTaskByPriority(id: number, priority: Priority): Promise<Todo> {
    await this.findOne(id);
    const updatedTaskPriority = { id, priority } as UpdateTodoDto;

    try {
      const updates = await this.todosRepository.update(
        id,
        updatedTaskPriority,
      );

      return updates as any as Todo;
    } catch (err) {
      throw err;
    }
  }

  async updateTaskByType(id: number, type: TaskType): Promise<Todo> {
    await this.findOne(id);
    const updateTaskCategory = { id, category: type } as UpdateTodoDto;

    try {
      const updates = await this.todosRepository.update(id, updateTaskCategory);

      return updates as any as Todo;
    } catch (err) {
      throw err;
    }
  }

  async updateTaskImportance(id: number, importance: boolean): Promise<Todo> {
    await this.findOne(id);
    const updateTaskImportance = {
      id,
      importance,
    } as UpdateTodoDto;

    try {
      const updatedTask = await this.todosRepository.update(
        id,
        updateTaskImportance,
      );

      return updatedTask as any as Todo;
    } catch (err) {
      throw err;
    }
  }

  async remove(id: number): Promise<Todo> {
    const todo = await this.findOne(id);

    try {
      const res = await this.todosRepository.remove(todo);

      return res as Todo;
    } catch (err) {
      throw err;
    }
  }
}
