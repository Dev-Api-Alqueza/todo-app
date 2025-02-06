import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskNoteDto, GetTaskNoteDto, UpdateNoteDto } from "./dto/task";
import { TaskNote } from "./taskNote.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class TaskNoteService {
  constructor(
    @InjectRepository(TaskNote)
    private readonly taskRepository: Repository<TaskNote>,
  ) {}

  async createNote(createNoteDto: CreateTaskNoteDto): Promise<TaskNote> {
    try {
      const existingNote = await this.taskRepository.findOne({
        where: { createdAt: createNoteDto.createdAt },
      });
      if (existingNote) {
        existingNote.content = createNoteDto.content;
        return await this.taskRepository.save(existingNote);
      }
      const createNote = this.taskRepository.create(createNoteDto);
      return await this.taskRepository.save(createNote);
    } catch (err) {
      throw err;
    }
  }

  async getNoteByDate(getNoteDto: GetTaskNoteDto): Promise<TaskNote> {
    try {
      const note = await this.taskRepository.findOne({
        where: { createdAt: getNoteDto.date },
      });

      if (!note) {
        throw new NotFoundException(
          `Task Note with Date: ${getNoteDto.date} not found`,
        );
      }
      return note;
    } catch (err) {
      throw err;
    }
  }

  async updateNote(updateNoteDto: UpdateNoteDto): Promise<TaskNote> {
    try {
      const note = await this.taskRepository.findOne({
        where: { createdAt: updateNoteDto.date },
      });

      if (!note) {
        throw new NotFoundException(
          `Task Note with Date: ${updateNoteDto.date} not found`,
        );
      }
      note.content = updateNoteDto.content;
      return await this.taskRepository.save(note);
    } catch (err) {
      throw err;
    }
  }
}
