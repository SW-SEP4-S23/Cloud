import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ExampleModule } from "./example/example.module";
import { TemperatureModule } from "./temperature/temperature.module";
import { HumidityModule } from "./humidity/humidity.module";
import { Co2Module } from "./co2/co2.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ExampleModule,
    TemperatureModule,
    HumidityModule,
    Co2Module,
  ],
})
export class AppModule {}
