import { DatabaseModule } from '../../../../apps/web/src/database/database.module';
import { UserEventHandler } from './user.event';
import { UserService } from './user.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule],
  providers: [UserService, UserEventHandler],
  exports: [UserService],
})
export class UserModule {}
