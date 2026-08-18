import {
  Client,
  DistanceMatrixResponseData,
  TravelMode,
} from '@googlemaps/google-maps-services-js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientRequestsService extends Client {
  API_KEY = 'AIzaSyAe7ENmBNhws08ml_9ikRYt7caOKVFsNic';

  constructor() {
    super();
  }

  async getTimeAndDistanceClientRequest(
    origin_lat: number,
    origin_lng: number,
    destination_lat: number,
    destination_lng: number,
  ): Promise<DistanceMatrixResponseData> {
    const googleResponse = await this.distancematrix({
      params: {
        mode: TravelMode.driving,
        key: this.API_KEY,
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

    return googleResponse.data;
  }
}
