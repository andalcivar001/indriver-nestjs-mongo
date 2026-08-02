import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
  ) {}

  async create(role: CreateRoleDto) {
    try {
      const newRole = new this.roleModel(role);
      return await newRole.save();
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() {
    return await this.roleModel.find();
  }

  async findOne(id: string) {
    const role = await this.roleModel.findById(id);

    if (!role) {
      throw new HttpException('Role no existe', HttpStatus.NOT_FOUND);
    }

    return role;
  }

  async update(id: string, role: UpdateRoleDto) {
    try {
      const roleFound = await this.roleModel.findById(id);

      if (!roleFound) {
        throw new HttpException('Rol no existe', HttpStatus.NOT_FOUND);
      }

      Object.assign(roleFound, role);
      return await roleFound.save();
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string) {
    const deleted = await this.roleModel.findByIdAndDelete(id);

    if (!deleted) {
      throw new HttpException('Rol no existe', HttpStatus.NOT_FOUND);
    }

    return { message: 'Rol eliminado correctamente' };
  }
}
