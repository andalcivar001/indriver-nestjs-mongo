import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { compare } from 'bcrypt';
import { hash } from 'bcrypt';

import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async register(user: RegisterAuthDto) {
    try {
      // 1) validar si email existe
      const emailExists = await this.userModel
        .findOne({ email: user.email })
        .lean();
      if (emailExists) {
        throw new HttpException('El email ya existe', HttpStatus.CONFLICT);
      }

      // 2) crear usuario (si tu UsersService ya hashea, ideal es re-usarlo;
      // aquí asumo que `user.password` ya llega hasheada o tienes middleware)
      const { rolesIds, ...userData } = user;
      userData.password = await hash(userData.password, 10);

      const normalizedRoles = (rolesIds ?? []).map((roleId) => {
        if (!Types.ObjectId.isValid(roleId)) {
          throw new HttpException('Rol inválido', HttpStatus.BAD_REQUEST);
        }
        return new Types.ObjectId(roleId);
      });

      const userSaved = await this.userModel.create({
        ...userData,
        roles: normalizedRoles,
      });
      const userWithRoles = await this.userModel
        .findById(userSaved._id)
        .populate('roles')
        .exec();

      // 3) payload JWT
      const payload = {
        id: userWithRoles!._id.toString(),
        name: (userWithRoles as any).nombre ?? (userWithRoles as any).name,
      };

      const token = this.jwtService.sign(payload);

      // 4) quitar password de la respuesta
      const userObj = userWithRoles!.toObject();
      const { password, ...userWithoutPassword } = userObj;

      return {
        user: userWithoutPassword,
        token: 'Bearer ' + token,
      };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(loginData: LoginAuthDto) {
    const { email, password: pwd } = loginData;

    // Si en tu schema tienes password con select:false,
    // necesitas traerlo explícitamente con .select('+password')
    const userFound = await this.userModel
      .findOne({ email })
      .select('+password')
      .populate('roles')
      .exec();

    if (!userFound) {
      throw new HttpException(
        'El usuario no esta registrado',
        HttpStatus.NOT_FOUND,
      );
    }

    const isPwdValid = await compare(pwd, userFound.password);
    if (!isPwdValid) {
      throw new HttpException(
        'La contraseña es incorrecta',
        HttpStatus.FORBIDDEN,
      );
    }

    const payload = {
      id: userFound._id.toString(),
      name: (userFound as any).nombre ?? (userFound as any).name,
    };

    const token = this.jwtService.sign(payload);

    const userObj = userFound.toObject();
    const { password, ...userWithoutPassword } = userObj;
    const roles = (userFound.roles ?? []).map((role) => {
      if (role && typeof role === 'object' && 'toObject' in role) {
        return (role as any).toObject();
      }
      return role;
    });

    return {
      user: {
        ...userWithoutPassword,
        roles,
      },
      roles,
      token: 'Bearer ' + token,
    };
  }
}
