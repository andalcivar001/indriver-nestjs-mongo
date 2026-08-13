import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type DriversPositionDocument = HydratedDocument<DriversPosition>;

@Schema({
  collection: 'drivers_position',
  timestamps: true,
})
export class DriversPosition {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
    unique: true,
  })
  id_driver: Types.ObjectId;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  })
  position: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export const DriversPositionSchema =
  SchemaFactory.createForClass(DriversPosition);

DriversPositionSchema.index({ position: '2dsphere' });
