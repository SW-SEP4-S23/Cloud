import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { ormConfig } from "../typeorm.config";
import { ExampleModule } from "./example/example.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(ormConfig),
    ExampleModule,
  ],
})
export class AppModule {}
