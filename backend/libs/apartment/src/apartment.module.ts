import { ApartmentService } from './apartment.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [ApartmentService],
  exports: [ApartmentService],
})
export class ApartmentModule {}
