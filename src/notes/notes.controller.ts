import { Body, Controller, Post, Put } from "@nestjs/common";
import { TaskNoteService } from "./notes.service";
import { CreateTaskNoteDto, GetTaskNoteDto, UpdateNoteDto } from "./dto/task";
import { TaskNote } from "./taskNote.entity";

@Controller("note")
export class TaskNoteController {
  constructor(private readonly taskService: TaskNoteService) {}
  @Post()
  async createNote(
    @Body() createNoteDto: CreateTaskNoteDto,
  ): Promise<TaskNote> {
    return this.taskService.createNote(createNoteDto);
  }
  @Post("getByDate")
  async getNoteByDate(@Body() getNoteDto: GetTaskNoteDto): Promise<TaskNote> {
    return this.taskService.getNoteByDate(getNoteDto);
  }
  @Put()
  async updateNote(@Body() updateNoteDto: UpdateNoteDto): Promise<TaskNote> {
    return this.taskService.updateNote(updateNoteDto);
  }
}
