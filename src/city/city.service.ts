import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCityDto } from './dto/create-city.dto';
import { FindCitiesDistanceDto } from './dto/find-cities-distance.dto';
import { City, CityDocument } from './schemas/city.schema';

@Injectable()
export class CityService {
  constructor(
    @InjectModel(City.name)
    private readonly cityModel: Model<CityDocument>,
  ) {}

  async create(createCityDto: CreateCityDto): Promise<CityDocument> {
    const city = new this.cityModel(createCityDto);
    return city.save();
  }

  async findAllWithDistance(location: FindCitiesDistanceDto) {
    return this.cityModel.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [location.longitude, location.latitude],
          },
          key: 'position',
          spherical: true,
          distanceField: 'distance',
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          distance: 1,
        },
      },
    ]);
  }
}
