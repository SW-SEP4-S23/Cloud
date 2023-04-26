import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Datapoint as Temperature } from '../entities/datapoint.entity';

@Injectable()
export class TemperatureService {
    getTest() {
        return "Hello Simon Mr Manderson - this is a test"
    }
    
    constructor(
        @InjectRepository(Temperature)
        private temperatureRepository: Repository<Temperature>
    ){}

    getTemperature() {
        
        //Returning a list of temperatures for the database
        return this.temperatureRepository.find({ select: ["temperature","timestamp"]});

    }
}