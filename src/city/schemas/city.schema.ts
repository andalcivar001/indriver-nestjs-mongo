// city.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CityDocument = HydratedDocument<City>;

@Schema({
  collection: 'cities',
  timestamps: true,
})
export class City {
  @Prop({
    required: true,
    trim: true,
    maxlength: 1000,
  })
  name: string;

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

export const CitySchema = SchemaFactory.createForClass(City);

// Equivale a: SPATIAL INDEX(position)
CitySchema.index({ position: '2dsphere' });
