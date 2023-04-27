import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { WebsocketService } from "./websocket/websocket.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Cloud API")
    .setDescription("The Cloud API for SEP4")
    .setVersion("1.0")
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api", app, swaggerDocument);

  await app.listen(3000);
}
bootstrap();
