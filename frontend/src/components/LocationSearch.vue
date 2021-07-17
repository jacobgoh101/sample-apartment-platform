<template>
  <b-autocomplete
    :data="options"
    placeholder="e.g. Times Square"
    field="display_name"
    :loading="isFetching"
    @typing="handleTyping"
    @select="handleSelect"
    :disabled="disabled"
  >
    <template slot-scope="props">
      <div class="media">
        <div class="media-content">
          {{ props.option.display_name }}
          <br />
          <small>
            {{ props.option.lon }},
            {{ props.option.lat }}
          </small>
        </div>
      </div>
    </template>
  </b-autocomplete>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api';
import { debounce } from 'lodash';
import { LocationIqPlace } from '@/types/geo-coding.types';
import { useGeoCodingApi } from '@/hooks/geo-coding.hook';

export default defineComponent({
  props: { disabled: Boolean },
  setup(__, { emit }) {
    const q = ref('');

    const handleTyping = debounce((e: string) => {
      q.value = e;
    }, 500);

    const handleSelect = (options: LocationIqPlace) => {
      emit('select', options);
    };

    const { data, isFetching } = useGeoCodingApi(q);
    const options = computed(() => {
      return data.value?.data || [];
    });

    return { q, options, handleTyping, handleSelect, data, isFetching };
  },
});
</script>

<style lang="scss"></style>
