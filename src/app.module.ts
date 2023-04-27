import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ExampleModule } from "./example/example.module";
import { TemperatureModule } from "./temperature/temperature.module";

@Module({
  imports: [ConfigModule.forRoot(), ExampleModule],
})
export class AppModule {}
