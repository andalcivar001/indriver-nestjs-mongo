import { Module } from '@nestjs/common';
import { ClientRequestsService } from './client-requests.service';
import { ClientRequestsController } from './client-requests.controller';

@Module({
  providers: [ClientRequestsService],
  controllers: [ClientRequestsController]
})
export class ClientRequestsModule {}
