import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, now, Types } from 'mongoose';
import { Role } from 'src/roles/schemas/role.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  lastname: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, trim: true })
  password: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ default: '' })
  image: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({
    type: [{ type: Types.ObjectId, ref: Role.name }],
    default: [],
  })
  roles: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
