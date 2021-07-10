import { DatabaseModule } from '../../../../apps/web/src/database/database.module';
import { NotificationModule } from '../../../notification/src';
import { UserEventHandler } from './user.event';
import { UserService } from './user.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule, NotificationModule],
  providers: [UserService, UserEventHandler],
  exports: [UserService],
})
export class UserModule {}
