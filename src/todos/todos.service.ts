// todos/todos.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  GetCompletedTaskResponse,
  GetSummaryResponse,
  GetWeeklyTaskResponse,
} from "@todo-app/interfaces";
import { effortBurnComputation, formatDate } from "@todo-app/utilities";
import {
  LessThanOrEqual,
  IsNull,
  Repository,
  Not,
  LessThan,
  In,
} from "typeorm";
import {
  CreateTodoDto,
  UpdateTodoDto,
  GetDateTodoDto,
  GetWeeklyTodoDto,
  AddNoteByTaskDto,
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

  // async getAllTask(): Promise<Todo[]> {
  //   try {
  //     const tasks = await this.todosRepository.find({
  //       order: { createdAt: "ASC" },
  //     });
  //     return tasks;
  //   } catch (err) {
  //     throw err;
  //   }
  // }

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
        date: string;
      }
      const tasks = (await this.todosRepository
        .createQueryBuilder("users_tasks")
        .select(
          `DAYNAME(createdAt) AS day_of_week,
          DATE(createdAt) AS date,
          COUNT(CASE WHEN STATUS = 'completed' THEN 1 END) AS completed_count,
          COUNT(CASE WHEN STATUS != 'completed' THEN 1 END) AS incomplete_count`,
        )
        .where(
          `category = :category 
          AND createdAt BETWEEN 
            DATE_SUB(CURRENT_DATE, INTERVAL WEEKDAY(CURRENT_DATE) DAY)
            AND 
            DATE_ADD(DATE_SUB(CURRENT_DATE, INTERVAL WEEKDAY(CURRENT_DATE) DAY), INTERVAL 7 DAY)`,
          { ...getWeekly },
        )
        .groupBy("DAYOFWEEK(createdAt), DATE(createdAt)")
        .orderBy("FIELD(DAYOFWEEK(createdAt), 2, 3, 4, 5, 6, 7, 1)")
        .execute()) as TaskQueryResponse[];

      const result = DayOfTheWeek.reduce((acc, day) => {
        const dayData = tasks.find((item) => item.day_of_week === day);
        acc[day] = {
          date: dayData ? dayData.date : null,
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
        .where("DATE(createdAt) <= DATE(CURRENT_DATE)", {
          created: summaryDto.date,
          // category: summaryDto.category,
        })
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

  //phase 3
  async getAllTask(userId: number): Promise<any> {
    try {
      const tasks = await this.todosRepository.find({
        where: { userId },
        order: { createdAt: "ASC" },
      });
      // await this.todosRepository
      //   .createQueryBuilder("users_tasks")
      //   .update(`users_tasks`)
      //   .set({ status: "todo" })
      //   .where(`Date(createdAt) = Date(CURRENT_DATE)`)
      //   .execute();
      const filterByDate = tasks.reduce((acc, item) => {
        const createdAtKey = formatDate(item.createdAt);
        if (!acc[createdAtKey]) {
          acc[createdAtKey] = [];
        }
        acc[createdAtKey].push({
          ...item,
        });
        return acc;
      }, {});

      return filterByDate;
    } catch (err) {
      throw err;
    }
  }

  //phase 3
  async getSummary(userId: number): Promise<GetSummaryResponse> {
    try {
      interface Summary {
        completed_count: string;
        inprogress_count: string;
        todo_count: string;
      }
      const tasks = await this.todosRepository
        .createQueryBuilder("users_tasks")
        .select(
          `COUNT(CASE WHEN DATE(createdAt) <= DATE(CURRENT_DATE) AND STATUS = "todo" THEN 1 END) AS todo_count,
            COUNT(CASE WHEN DATE(createdAt) <= DATE(CURRENT_DATE) AND STATUS = "in_progress" THEN 1 END) AS inprogress_count,
            COUNT(CASE WHEN DATE(createdAt) = DATE(CURRENT_DATE) AND STATUS = "completed" THEN 1 END) AS completed_count`,
        )
        .where("userId = :userId", { userId })
        .execute();

      const result: GetSummaryResponse = tasks.map((x: Summary) => ({
        completed: x.completed_count,
        inprogress: x.inprogress_count,
        todo: x.todo_count,
      }));
      return result[0];
    } catch (err) {
      throw err;
    }
  }

  //phase 3
  async getAllCompletedTask(
    userId: number,
  ): Promise<GetCompletedTaskResponse[]> {
    try {
      const tasks = await this.todosRepository.find({
        where: { userId, status: Status.COMPLETED },
        order: {
          completedAt: "ASC",
          importance: "DESC",
          priority: "ASC",
        },
      });
      const filteredTask = tasks.map((item) => ({
        ...item,
        effortBurn: effortBurnComputation(item.updatedAt, item.completedAt),
      }));

      return filteredTask;
    } catch (err) {
      throw err;
    }
  }

  //phase 3
  async getAllBacklogTask(userId: number): Promise<Todo[]> {
    try {
      const tasks = await this.todosRepository.find({
        where: { userId, status: Status.NOT_SET },
        order: {
          createdAt: "ASC",
          importance: "DESC",
          priority: "ASC",
        },
      });
      return tasks;
    } catch (err) {
      throw err;
    }
  }

  //phase 3
  async getAllIncompleteTaskToday(userId: number): Promise<Todo[]> {
    try {
      //auto update of the task in current date
      await this.todosRepository
        .createQueryBuilder("users_tasks")
        .update("users_tasks")
        .set({ status: "todo" })
        .where(
          `Date(createdAt) = Date(CURRENT_DATE) AND status = "not_set" AND userId = :userId`,
          { userId },
        )
        .execute();

      const tasks = await this.todosRepository.find({
        where: {
          userId,
          createdAt: LessThanOrEqual(new Date(formatDate(new Date()))),
          status: Not(In([Status.COMPLETED, Status.NOT_SET])),
        },
        order: {
          createdAt: "ASC",
          importance: "DESC",
          category: "ASC",
          priority: "ASC",
        },
      });

      return tasks;
    } catch (err) {
      throw err;
    }
  }

  //phase 3
  async getAllCompletedTaskToday(
    userId: number,
  ): Promise<GetCompletedTaskResponse[]> {
    try {
      const tasks = await this.todosRepository
        .createQueryBuilder("users_tasks")
        .where(
          `Date(completedAt) = Date(CURRENT_DATE) AND userId = :userID AND status = "completed"`,
          { userID: userId },
        )
        .orderBy("completedAt", "ASC")
        .addOrderBy("importance", "DESC")
        .addOrderBy("category", "ASC")
        .addOrderBy("priority", "ASC")
        .getMany();
      const filteredTask = tasks.map((item) => ({
        ...item,
        effortBurn: effortBurnComputation(item.updatedAt, item.completedAt),
      }));

      return filteredTask;
    } catch (err) {
      throw err;
    }
  }

  //phase 3
  async addNoteByTask(addNoteDto: AddNoteByTaskDto): Promise<Todo> {
    try {
      const existingNote = await this.todosRepository.findOne({
        where: { id: addNoteDto.id },
      });
      existingNote.note = addNoteDto.note;
      return await this.todosRepository.save(existingNote);
    } catch (err) {
      throw err;
    }
  }

  // async createNote(createNoteDto: CreateTaskNoteDto): Promise<TaskNote> {
  //     try {
  //       const existingNote = await this.taskRepository.findOne({
  //         where: { createdAt: createNoteDto.createdAt },
  //       });
  //       if (existingNote) {
  //         existingNote.content = createNoteDto.content;
  //         return await this.taskRepository.save(existingNote);
  //       }
  //       const createNote = this.taskRepository.create(createNoteDto);
  //       return await this.taskRepository.save(createNote);
  //     } catch (err) {
  //       throw err;
  //     }
  //   }

  // async getAllCompletedTask(
  //   getTaskDto: GetDateTodoDto,
  // ): Promise<GetCompletedTaskResponse[]> {
  //   const tasks = await this.todosRepository
  //     .createQueryBuilder("users_tasks")
  //     .where(
  //       `status = :status AND DATE(completedAt) = :completed AND category = :category`,
  //       {
  //         status: Status.COMPLETED,
  //         completed: getTaskDto.date,
  //         category: getTaskDto.category,
  //       },
  //     )
  //     .orderBy("category", "ASC")
  //     .addOrderBy("priority", "ASC")
  //     .getMany();
  //   const filteredTask = tasks.map((item) => ({
  //     ...item,
  //     effortBurn: effortBurnComputation(item.updatedAt, item.completedAt),
  //   }));

  //   return filteredTask;
  // }

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
