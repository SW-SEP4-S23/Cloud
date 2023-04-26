import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Datapoint } from "../entities/datapoint.entity";
import { TemperatureService } from "./temperature.service";
import { TemperatureController } from "./temperature.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Datapoint])],
    providers: [TemperatureService],
    controllers: [TemperatureController],
})
export class TemperatureModule {}