import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateDriversPositionDto } from './dto/create-drivers-position.dto';
import { UpdateDriversPositionDto } from './dto/update-drivers-position.dto';
import { DriversPositionService } from './drivers-position.service';
import { ParseMongoIdPipe } from './pipes/parse-mongo-id.pipe';
import { NearbyDriversDto } from './dto/nearby-drivers.dto';

@Controller('drivers-position')
export class DriversPositionController {
  constructor(
    private readonly driversPositionService: DriversPositionService,
  ) {}

  @Post()
  create(@Body() createDriversPositionDto: CreateDriversPositionDto) {
    return this.driversPositionService.create(createDriversPositionDto);
  }

  @Get('nearby/:latitud/:longitud')
  getNearbyDrivers(@Param() location: NearbyDriversDto) {
    return this.driversPositionService.getNearbyDrivers(location);
  }

  @Delete('driver/:idDriver')
  removeByDriverId(@Param('idDriver', ParseMongoIdPipe) idDriver: string) {
    return this.driversPositionService.removeByDriverId(idDriver);
  }
}
