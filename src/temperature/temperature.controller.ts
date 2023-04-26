import {Body, Controller, Get} from '@nestjs/common';
import {TemperatureService} from './temperature.service';

@Controller('temperature')
export class TemperatureController { 
    constructor (private readonly temperatureService: TemperatureService) {}

    //TODO : Change the get method so it takes two dates, and returns all temperatures inbetween those dates.
    @Get()
    findAll() {
        return this.temperatureService.getTemperature();
    }

    @Get('test')
    DvaRule34() {
        return  this.temperatureService.getTest();
    }
    
}