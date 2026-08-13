import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DriversPositionService } from './drivers-position.service';
import { DriversPositionController } from './drivers-position.controller';
import {
  DriversPosition,
  DriversPositionSchema,
} from './schemas/drivers-position.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DriversPosition.name, schema: DriversPositionSchema },
    ]),
  ],
  providers: [DriversPositionService],
  controllers: [DriversPositionController],
})
export class DriversPositionModule {}
