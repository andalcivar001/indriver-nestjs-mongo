import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTimeAndDistanceValueDto {
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  km_value: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  min_value: number;
}
