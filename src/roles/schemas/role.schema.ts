import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, now, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type RoleDocument = Role & Document;

@Schema({ timestamps: true })
export class Role {
  @Prop({ required: true, trim: true, unique: true })
  typeRole: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  route: string;

  @Prop({ default: '' })
  image: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
