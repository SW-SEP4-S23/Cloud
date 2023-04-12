import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { ormConfig } from "../typeorm.config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forRoot(ormConfig)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
