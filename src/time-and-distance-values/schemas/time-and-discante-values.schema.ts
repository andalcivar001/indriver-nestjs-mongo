import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, now, Types } from 'mongoose';

export type TimeAndDistanceValuesDocument = TimeAndDistanceValues & Document;

@Schema({ timestamps: true })
export class TimeAndDistanceValues {
  @Prop({ required: true, type: Number })
  km_value: number;

  @Prop({ required: true, type: Number })
  min_value: number;
}

export const TimeAndDistanceValuesSchema = SchemaFactory.createForClass(
  TimeAndDistanceValues,
);
