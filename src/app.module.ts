import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TemperatureModule } from "./temperature/temperature.module";
import { HumidityModule } from "./humidity/humidity.module";
import { Co2Module } from "./co2/co2.module";
import { WebSocketModule } from "./websocket/websocket.module";
import { EnvironmentModule } from "./environment/environment.module";
import { PrismaModule } from "nestjs-prisma";
import { SpeciesModule } from "./plant_species/species.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule.forRoot({ isGlobal: true }),
    TemperatureModule,
    HumidityModule,
    Co2Module,
    EnvironmentModule,
    WebSocketModule,
    SpeciesModule,
  ],
})
export class AppModule {}
