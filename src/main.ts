import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import helmet from "helmet";
import { AppModule } from "./app.module";

// Vercel handler export
export default async function handler(req, res) {
  const app = await NestFactory.create(AppModule, { cors: true });
  const apiPrefix = "api";

  app.use(cookieParser());
  app.use(helmet());
  app.setGlobalPrefix(apiPrefix);
  app.enableCors({ credentials: true });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Vercel functions expect the handler to respond to requests
  await app.init();
  app.getHttpAdapter().getInstance().handle(req, res);
}
