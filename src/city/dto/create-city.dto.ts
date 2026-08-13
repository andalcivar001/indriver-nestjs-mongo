import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class PositionDto {
  @IsIn(['Point'])
  type: 'Point';

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  coordinates: [number, number];
}

export class CreateCityDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  name: string;

  @ValidateNested()
  @Type(() => PositionDto)
  position: PositionDto;
}
