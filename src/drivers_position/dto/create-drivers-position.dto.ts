import { Type } from 'class-transformer';
import { IsLatitude, IsLongitude, IsMongoId, IsNumber } from 'class-validator';

export class CreateDriversPositionDto {
  @IsMongoId()
  id_driver: string;

  @Type(() => Number)
  @IsNumber()
  @IsLatitude()
  lat: number;

  @Type(() => Number)
  @IsNumber()
  @IsLongitude()
  lng: number;
}
