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
import { ClientRequestsModule } from './client-requests/client-requests.module';
import { TimeAndDistanceValuesModule } from './time-and-distance-values/time-and-distance-values.module';

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
    ClientRequestsModule,
    TimeAndDistanceValuesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
