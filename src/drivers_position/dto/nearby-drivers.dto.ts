import { Type } from 'class-transformer';
import { IsLatitude, IsLongitude, IsNumber } from 'class-validator';

export class NearbyDriversDto {
  @Type(() => Number)
  @IsNumber()
  @IsLatitude()
  latitud: number;

  @Type(() => Number)
  @IsNumber()
  @IsLongitude()
  longitud: number;
}
