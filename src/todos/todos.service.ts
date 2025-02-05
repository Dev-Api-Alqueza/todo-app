// todos/todos.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GetCompletedTaskResponse } from "@todo-app/interfaces";
import { effortBurnComputation } from "@todo-app/utilities";
import { Repository } from "typeorm";
import { CreateTodoDto, UpdateTodoDto } from "./dto";
import { Priority, Status, TaskType } from "./enums";
import { Todo } from "./todos.entity";

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

  async getAllCompletedTask(): Promise<GetCompletedTaskResponse[]> {
    const tasks = await this.todosRepository.find({
      where: { status: Status.COMPLETED },
      order: { completedAt: "ASC" },
    });
    const filteredTask = tasks.map((item) => ({
      ...item,
      effortBurn: effortBurnComputation(item.createdAt, item.completedAt),
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
    const completion = task.setStatus(status);
    const updatedTaskStatus = {
      id,
      status,
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
