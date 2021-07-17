<template>
  <b-autocomplete
    :data="options"
    placeholder="e.g. Times Square"
    field="display_name"
    :loading="isFetching"
    @typing="handleTyping"
    @select="handleSelect"
    :disabled="disabled"
    :icon-right="useDetectLocationIcon && 'crosshairs-gps'"
    :icon-right-clickable="!disabled && useDetectLocationIcon"
    @icon-right-click="handleSelectCurrentLocation"
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
    <template v-slot:empty>
      <span v-if="isFetching"> Loading... </span>
      <span v-else> No results found</span>
    </template>
  </b-autocomplete>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api';
import { debounce } from 'lodash';
import { Coordinate, LocationIqPlace } from '@/types/geo-coding.types';
import { useGeoCodingApi } from '@/hooks/geo-coding.hook';
import { DialogProgrammatic } from 'buefy';

export default defineComponent({
  props: { disabled: Boolean, useDetectLocationIcon: Boolean },
  setup(__, { emit }) {
    const q = ref('');

    const handleTyping = debounce((e: string) => {
      q.value = e;
    }, 500);

    const emitSelect = ({ lon, lat }: Coordinate) =>
      emit('select', { lon, lat });

    const handleSelect = (loc: LocationIqPlace) => {
      emitSelect({ lon: +loc?.lon, lat: +loc?.lat });
    };

    const handleSelectCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          emitSelect({ lon, lat });
        });
      } else {
        DialogProgrammatic.alert(
          'Geolocation is not supported by this browser.'
        );
      }
    };

    const { data, isFetching } = useGeoCodingApi(q);
    const options = computed(() => {
      return data.value?.data || [];
    });

    return {
      q,
      options,
      handleTyping,
      handleSelect,
      handleSelectCurrentLocation,
      data,
      isFetching,
    };
  },
});
</script>

<style lang="scss"></style>
