import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const apiPrefix = "api";

  app.use(cookieParser());
  app.use(helmet());
  app.setGlobalPrefix(apiPrefix);
  app.enableCors({ credentials: true });

  app.useGlobalPipes(
    //automatically throws an exception
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();

export { bootstrap };
