import { computed, Ref } from '@vue/composition-api';

export const useSome = (...arr: Array<Ref<unknown>>) =>
  computed(() => arr.some((v) => !!v.value));
