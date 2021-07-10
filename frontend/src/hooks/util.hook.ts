import { computed, Ref } from '@vue/composition-api';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { UseQueryOptions } from 'react-query';
dayjs.extend(duration);

export const twentyFourHoursInMs = dayjs.duration(24, 'hour').asMilliseconds();
export const fetchOnceQueryOption: Partial<UseQueryOptions<any>> = {
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
  retry: false,
  staleTime: twentyFourHoursInMs,
};

export const useSome = (...arr: Array<Ref<unknown>>) =>
  computed(() => arr.some((v) => !!v.value));
