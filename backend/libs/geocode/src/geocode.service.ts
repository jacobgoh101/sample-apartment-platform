import { ENV } from '../../config/env';
import { HttpService, Logger, Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ServiceUnavailableException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/common';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class GeocodeService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  geocode(q: string) {
    Logger.log(q, 'Calling Location IQ API');
    if (!q?.trim?.()) return of([]);
    try {
      return this.httpService
        .get('https://us1.locationiq.com/v1/search.php', {
          params: {
            format: 'json',
            key: ENV.LOCATION_IQ_QPI_KEY,
            q,
          },
        })
        .pipe(map((d) => d.data));
    } catch (error) {
      Logger.error(error, 'geocode error');
      throw new ServiceUnavailableException();
    }
  }
}
