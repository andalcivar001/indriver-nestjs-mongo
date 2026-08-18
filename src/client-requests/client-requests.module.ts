import { Module } from '@nestjs/common';
import { ClientRequestsService } from './client-requests.service';
import { ClientRequestsController } from './client-requests.controller';
import { TimeAndDistanceValuesModule } from 'src/time-and-distance-values/time-and-distance-values.module';

@Module({
  providers: [ClientRequestsService],
  controllers: [ClientRequestsController],
  imports: [TimeAndDistanceValuesModule],
})
export class ClientRequestsModule {}
