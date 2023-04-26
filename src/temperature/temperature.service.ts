import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Temperature } from './temperature.entity';

@Injectable()
export class TemperatureService {
    constructor(
        @InjectRepository(Temperature)
        private temperatureRepository: Repository<Datapoint>
    ){}

    getTemperature(): number {
        return this.temperatureRepository.findOne().temperature;
    }
}