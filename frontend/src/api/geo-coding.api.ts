import { LocationIqPlace } from '../types/geo-coding.types';
import { $axios } from './axios';
import pMemoize from 'p-memoize';

export const geoCodingApi = pMemoize((q: string) =>
  $axios.get<LocationIqPlace[]>('/geocode/json', {
    params: {
      q,
    },
  })
);
