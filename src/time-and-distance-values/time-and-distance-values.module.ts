import { Module } from '@nestjs/common';
import { TimeAndDistanceValuesService } from './time-and-distance-values.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TimeAndDistanceValues,
  TimeAndDistanceValuesSchema,
} from './schemas/time-and-discante-values.schema';
import { TimeAndDistanceValuesController } from './time-and-distance-values.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TimeAndDistanceValues.name, schema: TimeAndDistanceValuesSchema },
    ]),
  ],
  controllers: [TimeAndDistanceValuesController],
  providers: [TimeAndDistanceValuesService],
  exports: [TimeAndDistanceValuesService],
})
export class TimeAndDistanceValuesModule {}
