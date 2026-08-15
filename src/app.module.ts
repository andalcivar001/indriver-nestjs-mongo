import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { SocketModule } from './socket/socket.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DriversPositionModule } from './drivers_position/drivers-position.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    SocketModule,
    DriversPositionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
