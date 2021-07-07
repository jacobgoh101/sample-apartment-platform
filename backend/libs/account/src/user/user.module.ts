import { DatabaseModule } from '../../../../apps/web/src/database/database.module';
import { UserService } from './user.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
