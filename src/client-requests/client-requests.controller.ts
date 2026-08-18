import { Controller, Get, Param, ParseFloatPipe } from '@nestjs/common';
import { ClientRequestsService } from './client-requests.service';

@Controller('client-requests')
export class ClientRequestsController {
  constructor(private clientRequestsService: ClientRequestsService) {}

  @Get(':origin_lat/:origin_lng/:destination_lat/:destination_lng')
  getTimeAndDistanceClientRequest(
    @Param('origin_lat', ParseFloatPipe) originLat: number,
    @Param('origin_lng', ParseFloatPipe) originLng: number,
    @Param('destination_lat', ParseFloatPipe) destinationLat: number,
    @Param('destination_lng', ParseFloatPipe) destinationLng: number,
  ) {
    return this.clientRequestsService.getTimeAndDistanceClientRequest(
      originLat,
      originLng,
      destinationLat,
      destinationLng,
    );
  }
}
