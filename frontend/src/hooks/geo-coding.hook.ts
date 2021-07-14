import { useQuery } from 'vue-query';
import { geoCodingApi } from '../api/geo-coding.api';
import { Ref, computed, reactive } from '@vue/composition-api';
import { fetchOnceQueryOption } from './util.hook';

export const useGeoCodingApi = (q: Ref<string>) => {
  const query = useQuery(
    reactive(['geo-coding', q]),
    () => geoCodingApi(q.value),
    reactive({
      ...fetchOnceQueryOption,
      enabled: computed(() => !!q.value),
    })
  );

  return { ...query };
};
