import { ScheduleAdminController } from './schedule.admin.controller';
import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { Schedule } from './entities/schedule.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule]), UserModule],
  providers: [ScheduleService],
  controllers: [ScheduleController, ScheduleAdminController],
})
export class ScheduleModule {}
