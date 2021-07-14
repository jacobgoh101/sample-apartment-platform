import { GeocodeService } from './geocode.service';
import { Module, HttpModule } from '@nestjs/common';
import { CacheModule } from '@nestjs/common';

@Module({
  imports: [HttpModule, CacheModule.register()],
  providers: [GeocodeService],
  exports: [GeocodeService],
})
export class GeocodeModule {}
