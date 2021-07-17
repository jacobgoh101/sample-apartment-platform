import { ENV } from '../../config/env';
import { HttpService, Logger, Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/common';

@Injectable()
export class GeocodeService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async geocode(q: string) {
    Logger.log(q, 'Calling Location IQ API');
    if (!q?.trim?.()) return [];
    try {
      const { data } = await this.httpService
        .get('https://us1.locationiq.com/v1/search.php', {
          params: {
            format: 'json',
            key: ENV.LOCATION_IQ_QPI_KEY,
            q,
          },
        })
        .toPromise();
      return data;
    } catch (error) {
      Logger.error({ error }, 'geocode error');
      return [];
    }
  }
}
