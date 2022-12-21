import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { User } from './modules/user/entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { Schedule } from './modules/schedule/entities/schedule.entity';

@Module({
  imports: [
    UserModule,
    ScheduleModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('MYSQL_HOST'),
        port: configService.get('MYSQL_PORT'),
        username: configService.get('MYSQL_USER'),
        password: configService.get('MYSQL_USER_PASS'),
        database: configService.get('MYSQL_DB_NAME'),
        entities: [User, Schedule],
        // NOTE: normally this would not be true, for ease of use we will use this now
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
