import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTimeAndDistanceValueDto } from './dto/create-time-and-distance-value.dto';
import { TimeAndDistanceValuesService } from './time-and-distance-values.service';

@Controller('time-and-distance-values')
export class TimeAndDistanceValuesController {
  constructor(
    private readonly timeAndDistanceValuesService: TimeAndDistanceValuesService,
  ) {}

  @Post()
  create(@Body() values: CreateTimeAndDistanceValueDto) {
    return this.timeAndDistanceValuesService.create(values);
  }

  @Get()
  find() {
    return this.timeAndDistanceValuesService.find();
  }
}
