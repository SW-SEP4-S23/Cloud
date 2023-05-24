import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TemperatureModule } from "./environment/temperature/temperature.module";
import { HumidityModule } from "./environment/humidity/humidity.module";
import { Co2Module } from "./environment/co2/co2.module";
import { WebSocketModule } from "./websocket/websocket.module";
import { EnvironmentModule } from "./environment/environment.module";
import { PrismaModule } from "nestjs-prisma";
import { BatchModule } from "./stock/batch/batch.module";
import { PlantsModule } from "./stock/plants/plants.module";
import { LogsModule } from "./stock/logs/logs.module";
import { SpeciesModule } from "./stock/species/species.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule.forRoot({ isGlobal: true }),
    TemperatureModule,
    HumidityModule,
    Co2Module,
    EnvironmentModule,
    LogsModule,
    WebSocketModule,
    BatchModule,
    PlantsModule,
    SpeciesModule,
  ],
})
export class AppModule {}
