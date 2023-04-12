import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { DataSource } from "typeorm";
import { ormConfig } from "../typeorm.config";

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forRoot(ormConfig)],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
