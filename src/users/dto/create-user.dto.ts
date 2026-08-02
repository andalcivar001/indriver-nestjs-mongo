import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'El email no es valido' })
  email: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4, { message: 'La contraseña debe tener minimo 4 caracteres' })
  password: string;

  @IsOptional()
  image: string;
}
