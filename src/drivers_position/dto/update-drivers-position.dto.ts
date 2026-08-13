import { PartialType } from '@nestjs/mapped-types';
import { CreateDriversPositionDto } from './create-drivers-position.dto';

export class UpdateDriversPositionDto extends PartialType(
  CreateDriversPositionDto,
) {}
