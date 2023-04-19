import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { ormConfig } from "../../typeorm.config";
import { ExampleController } from "./example.controller";
import { ExampleService } from "./example.service";

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forRoot(ormConfig)],
  controllers: [ExampleController],
  providers: [ExampleService],
})
export class AppModule {}
