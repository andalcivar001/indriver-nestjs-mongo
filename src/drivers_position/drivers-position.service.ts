import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDriversPositionDto } from './dto/create-drivers-position.dto';
import { NearbyDriversDto } from './dto/nearby-drivers.dto';
import {
  DriversPosition,
  DriversPositionDocument,
} from './schemas/drivers-position.schema';

@Injectable()
export class DriversPositionService {
  constructor(
    @InjectModel(DriversPosition.name)
    private readonly driversPositionModel: Model<DriversPositionDocument>,
  ) {}

  async create(
    dto: CreateDriversPositionDto,
  ): Promise<DriversPositionDocument> {
    try {
      const driverPosition = await this.driversPositionModel
        .findOneAndUpdate(
          { id_driver: dto.id_driver },
          {
            $set: {
              position: {
                type: 'Point',
                coordinates: [dto.lng, dto.lat],
              },
            },
          },
          {
            upsert: true, // si no existe lo inserta caso contrario lo actualiza
            new: true,
            runValidators: true,
            setDefaultsOnInsert: true,
          },
        )
        .exec();

      if (!driverPosition) {
        throw new NotFoundException(
          'No se pudo guardar la posición del conductor',
        );
      }

      return driverPosition;
    } catch (error: unknown) {
      this.handleDuplicateKey(error);
      throw error;
    }
  }

  async getNearbyDrivers(location: NearbyDriversDto) {
    return this.driversPositionModel
      .aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [
                Number(location.longitud),
                Number(location.latitud),
              ],
            },
            key: 'position',
            distanceField: 'distance',
            maxDistance: 10000,
            spherical: true,
          },
        },

        // Muy importante: limitar resultados
        {
          $limit: 20,
        },

        {
          $project: {
            _id: 0,
            id_driver: {
              $toString: '$id_driver',
            },
            position: {
              lat: {
                $arrayElemAt: ['$position.coordinates', 1],
              },
              lng: {
                $arrayElemAt: ['$position.coordinates', 0],
              },
            },
            distance: 1,
          },
        },
      ])
      .exec();
  }

  async removeByDriverId(idDriver: string): Promise<DriversPositionDocument> {
    const driverPosition = await this.driversPositionModel
      .findOneAndDelete({ id_driver: idDriver })
      .exec();

    if (!driverPosition) {
      throw new NotFoundException('Posición del conductor no encontrada');
    }

    return driverPosition;
  }

  private handleDuplicateKey(error: unknown): void {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 11000
    ) {
      throw new ConflictException(
        'El conductor ya tiene una posición registrada',
      );
    }
  }
}
