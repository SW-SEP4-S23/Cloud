import { DataSource, DataSourceOptions } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";
import { join } from "path";

config();

const configService = new ConfigService();

export const ormConfig: DataSourceOptions = {
  type: "postgres",
  url: configService.get("DB_URL"),
  entities: [join(__dirname, "./src/**/*.entity.{ts,js}")],
  migrations: [join(__dirname, "./migrations/**/*.{ts,js}")],
  synchronize: process.env.NODE_ENV !== "production",
};

export default new DataSource(ormConfig);
