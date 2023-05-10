import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ExampleModule } from "./example/example.module";
import { TemperatureModule } from "./temperature/temperature.module";
import { HumidityModule } from "./humidity/humidity.module";
import { Co2Module } from "./co2/co2.module";
import { WebSocketModule } from "./websocket/websocket.module";
import { GenerelModule } from "./GenerelController/generel.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ExampleModule,
    TemperatureModule,
    HumidityModule,
    Co2Module,
    GenerelModule,
    WebSocketModule,
  ],
})
export class AppModule {}
