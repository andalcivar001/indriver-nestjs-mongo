import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import uploadFile from '../utils/cloud_storage';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(user: CreateUserDto) {
    try {
      const newUser = new this.userModel(user);
      return await newUser.save();
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() {
    return await this.userModel.find().populate('roles');
  }

  async update(id: string, user: UpdateUserDto) {
    try {
      const userFound = await this.userModel.findById(id);

      if (!userFound) {
        throw new HttpException('Usuario no existe', HttpStatus.NOT_FOUND);
      }

      Object.assign(userFound, user);
      return await userFound.save();
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateWithImage(file: Express.Multer.File, id: string, user: any) {
    try {
      const url = await uploadFile(file, file.originalname);

      if (!url) {
        throw new HttpException(
          'La imagen no se pudo guardar',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      let dto: UpdateUserDto;

      if (typeof user.user === 'string') {
        try {
          dto = JSON.parse(user.user);
        } catch (error) {
          throw new BadRequestException(
            'Formato JSON inválido',
            user.toString(),
          );
        }
      } else {
        dto = user;
      }

      const userFound = await this.userModel.findById(id);

      if (!userFound) {
        throw new HttpException('Usuario no existe', HttpStatus.NOT_FOUND);
      }

      dto.image = url;

      Object.assign(userFound, dto);
      return await userFound.save();
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
