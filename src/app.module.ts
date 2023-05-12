import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ExampleModule } from "./example/example.module";
import { TemperatureModule } from "./temperature/temperature.module";
import { HumidityModule } from "./humidity/humidity.module";
import { Co2Module } from "./co2/co2.module";
import { WebSocketModule } from "./websocket/websocket.module";
import { EnvironmentModule } from "./environment/environment.module";
import { PrismaModule } from "nestjs-prisma";

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule.forRoot({ isGlobal: true }),
    ExampleModule,
    TemperatureModule,
    HumidityModule,
    Co2Module,
    EnvironmentModule,
    WebSocketModule,
  ],
})
export class AppModule {}
