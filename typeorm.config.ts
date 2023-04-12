import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { join } from 'path';
 
config();
 
const configService = new ConfigService();
 
export const ormConfig: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [join(__dirname, './src/**/*.entity.{ts,js}')],
  migrations:  [join(__dirname, './migrations/**/*.{ts,js}')],
  synchronize: process.env.NODE_ENV === "development"
}

export default new DataSource(ormConfig);