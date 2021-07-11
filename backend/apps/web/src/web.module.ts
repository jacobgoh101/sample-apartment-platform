import { AuthModule } from '../../../libs/account/src/auth/auth.module';
import { UserModule } from '../../../libs/account/src/user/user.module';
import { ApartmentModule } from '../../../libs/apartment/src';
import { RbacModule } from '../../../libs/rbac/src/rbac.module';
import { ApartmentController } from './apartment/apartment.controller';
import { DatabaseModule } from './database/database.module';
import { RoleController } from './role/role.controller';
import { UserController } from './user/user.controller';
import { WebController } from './web.controller';
import { WebService } from './web.service';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    DatabaseModule,
    EventEmitterModule.forRoot(),
    AuthModule,
    UserModule,
    RbacModule,
    ApartmentModule,
  ],
  controllers: [
    WebController,
    UserController,
    RoleController,
    ApartmentController,
  ],
  providers: [WebService],
})
export class WebModule {}
