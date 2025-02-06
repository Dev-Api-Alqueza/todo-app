// src/app.module.ts
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import appConfig from "./config/app.config";
import { Todo } from "./todos/todos.entity";
import { TodosModule } from "./todos/todos.module";
import { TaskNote } from "./todos/taskNote.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig], // Load custom configuration
      isGlobal: true, // Make the config globally available
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule to use ConfigService
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get("app.db");
        return {
          type: dbConfig.type,
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          entities: [Todo, TaskNote],
          synchronize: true, //process.env.NODE_ENV !== "production",
        };
      },
      inject: [ConfigService],
    }),
    TodosModule,
  ],
})
export class AppModule {}
