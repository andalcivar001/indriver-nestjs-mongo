import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTimeAndDistanceValueDto } from './dto/create-time-and-distance-value.dto';
import {
  TimeAndDistanceValues,
  TimeAndDistanceValuesDocument,
} from './schemas/time-and-discante-values.schema';

@Injectable()
export class TimeAndDistanceValuesService {
  constructor(
    @InjectModel(TimeAndDistanceValues.name)
    private readonly timeAndDistanceValuesModel: Model<TimeAndDistanceValuesDocument>,
  ) {}

  async create(values: CreateTimeAndDistanceValueDto) {
    try {
      const newValues = new this.timeAndDistanceValuesModel(values);
      return await newValues.save();
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async find() {
    //trae el primero creado
    return this.timeAndDistanceValuesModel
      .findOne()
      .sort({ createdAt: 1 })
      .exec();
  }
}
