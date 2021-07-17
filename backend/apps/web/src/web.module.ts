import { AuthModule } from '../../../libs/account/src/auth/auth.module';
import { UserModule } from '../../../libs/account/src/user/user.module';
import { ApartmentModule } from '../../../libs/apartment/src';
import { GeocodeModule } from '../../../libs/geocode/src';
import { RbacModule } from '../../../libs/rbac/src/rbac.module';
import { ApartmentController } from './apartment/apartment.controller';
import { DatabaseModule } from './database/database.module';
import { GeocodeController } from './geocode/geocode.controller';
import { RoleController } from './role/role.controller';
import { UserController } from './user/user.controller';
import { WebController } from './web.controller';
import { WebService } from './web.service';
import { CacheModule, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    DatabaseModule,
    CacheModule.register(),
    EventEmitterModule.forRoot(),
    AuthModule,
    UserModule,
    RbacModule,
    ApartmentModule,
    GeocodeModule,
  ],
  controllers: [
    WebController,
    UserController,
    RoleController,
    ApartmentController,
    GeocodeController,
  ],
  providers: [WebService],
})
export class WebModule {}
