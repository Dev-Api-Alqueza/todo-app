import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TaskNote } from "./taskNote.entity";
import { TaskNoteController } from "./notes.controller";
import { TaskNoteService } from "./notes.service";

@Module({
  imports: [TypeOrmModule.forFeature([TaskNote])],
  controllers: [TaskNoteController],
  providers: [TaskNoteService],
})
export class TaskNoteModule {}
