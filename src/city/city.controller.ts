import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { FindCitiesDistanceDto } from './dto/find-cities-distance.dto';

@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  create(@Body() createCityDto: CreateCityDto) {
    return this.cityService.create(createCityDto);
  }

  @Get('distances')
  findAllWithDistance(@Query() location: FindCitiesDistanceDto) {
    return this.cityService.findAllWithDistance(location);
  }
}
