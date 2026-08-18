import {
  Client,
  DistanceMatrixResponseData,
  TravelMode,
} from '@googlemaps/google-maps-services-js';
import { Injectable } from '@nestjs/common';
import { TimeAndDistanceValuesService } from '../time-and-distance-values/time-and-distance-values.service';

@Injectable()
export class ClientRequestsService extends Client {
  constructor(
    private timeAndDistanceValuesService: TimeAndDistanceValuesService,
  ) {
    super();
  }

  async getTimeAndDistanceClientRequest(
    origin_lat: number,
    origin_lng: number,
    destination_lat: number,
    destination_lng: number,
  ) {
    const values = await this.timeAndDistanceValuesService.find();
    const kmValue = values?.km_value ?? 0;
    const minValue = values?.min_value ?? 0;

    const googleResponse = await this.distancematrix({
      params: {
        mode: TravelMode.driving,
        key: process.env.GOOGLE_API_KEY!,
        origins: [
          {
            lat: origin_lat,
            lng: origin_lng,
          },
        ],
        destinations: [
          {
            lat: destination_lat,
            lng: destination_lng,
          },
        ],
      },
    });

    const precioRecomendado =
      kmValue *
        (googleResponse.data.rows[0].elements[0].distance.value / 1000) +
      minValue * (googleResponse.data.rows[0].elements[0].duration.value / 60);

    return {
      recommended_value: precioRecomendado,
      destination_addresses: googleResponse.data.destination_addresses[0],
      origin_addresses: googleResponse.data.origin_addresses[0],
      distance: {
        text: googleResponse.data.rows[0].elements[0].distance.text,
        value: googleResponse.data.rows[0].elements[0].distance.value / 1000,
      },
      duration: {
        text: googleResponse.data.rows[0].elements[0].duration.text,
        value: googleResponse.data.rows[0].elements[0].duration.value / 60,
      },
    };
  }
}
