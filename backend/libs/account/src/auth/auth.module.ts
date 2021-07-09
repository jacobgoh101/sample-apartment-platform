import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { FacebookLoginStrategy } from './facebook-login.strategy';
import { GoogleLoginStrategy } from './google-login.strategy';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serializer';
import { HttpModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [UserModule, PassportModule, HttpModule],
  providers: [
    AuthService,
    LocalStrategy,
    GoogleLoginStrategy,
    FacebookLoginStrategy,
    SessionSerializer,
  ],
  exports: [AuthService],
})
export class AuthModule {}
