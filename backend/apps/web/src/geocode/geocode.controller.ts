import { AuthenticatedGuard } from '../../../../libs/account/src/auth/authenticated.guard';
import { GeocodeService } from '../../../../libs/geocode/src/geocode.service';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/common';

@Controller('geocode')
export class GeocodeController {
  constructor(private readonly geocodeService: GeocodeService) {}

  @UseGuards(AuthenticatedGuard)
  @Get('json')
  @UseInterceptors(CacheInterceptor)
  geocoding(@Query('q') q: string) {
    return this.geocodeService.geocode(q);
  }
}
