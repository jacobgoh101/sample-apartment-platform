import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  providers: [AccountService],
  exports: [AccountService],
  imports: [AuthModule, UserModule],
})
export class AccountModule {}
