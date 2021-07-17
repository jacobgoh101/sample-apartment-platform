import { RbacModule } from '../../rbac/src';
import { ApartmentService } from './apartment.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [RbacModule],
  providers: [ApartmentService],
  exports: [ApartmentService],
})
export class ApartmentModule {}
