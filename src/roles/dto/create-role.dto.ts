import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  typeRole: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  route: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
