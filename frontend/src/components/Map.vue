<template>
  <div class="mb-5">
    <GmapMap
      ref="mapRef"
      :center="center"
      :zoom="zoom"
      map-type-id="terrain"
      class="map"
    >
      <GmapMarker
        ref="markerRefs"
        v-for="apartment in apartments"
        :key="JSON.stringify(apartment)"
        :position="{ lat: apartment.latitude, lng: apartment.longitude }"
        :clickable="true"
        :draggable="false"
        @click="handleMarkerClick(apartment)"
      />

      <gmap-info-window
        :options="infoOptions"
        :position="infoWindowPos"
        :opened="!!infoWindowPos"
        @closeclick="infoWindowPos = null"
      >
      </gmap-info-window>
    </GmapMap>
    <!-- <pre>{{ center }}</pre>
    <pre>{{ zoom }}</pre>
    <pre>{{ apartments }}</pre> -->
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
} from '@vue/composition-api';
import { Apartment } from '../types/apartment.types';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { gmapApi } from 'gmap-vue';
import { waitUntil } from 'async-wait-until';

export default defineComponent<{
  apartments: Array<Apartment>;
}>({
  props: { apartments: Array },
  setup(props, { emit }) {
    const mapRef = ref(null);
    const markerRefs = ref(null);
    const center = ref({
      lat: props.apartments?.[0]?.latitude || 0,
      lng: props.apartments?.[0]?.longitude || 0,
    });
    const zoom = ref(12);
    const google = computed(() => gmapApi());
    const boundsValue = computed(() => {
      const lonArr = props.apartments.map((a) => a.longitude);
      const latArr = props.apartments.map((a) => a.latitude);
      return {
        lat: { min: Math.min(...latArr), max: Math.max(...latArr) },
        lon: { min: Math.min(...lonArr), max: Math.max(...lonArr) },
      };
    });
    const infoOptions = ref({
      content: '123',
      //optional: offset infowindow so it visually sits nicely on top of our marker
      pixelOffset: {
        width: 0,
        height: -35,
      },
    });
    const infoWindowPos = ref<any>(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleMarkerClick = (apartment: Apartment) => {
      const {
        latitude,
        longitude,
        name,
        description,
        floorAreaSquareMeter,
        numOfRooms,
        pricePerMonth,
        realtor: { email, name: realtorName },
      } = apartment;
      infoWindowPos.value = { lat: latitude, lng: longitude };
      infoOptions.value = {
        ...infoOptions.value,
        content: `
            <div class="media">
              <div class="media-content">
                <p class="title is-6">${name}</p>
              </div>
            </div>
            <p class="mb-2">${description}</p>
            <div>
              <span class="icon-text is-block" title="square meter">
                <span class="icon">
                  <i class="mdi mdi-information"></i>
                </span>
                <span> ${floorAreaSquareMeter} SQM </span>
              </span>
              <span class="icon-text is-block">
                <span class="icon">
                  <i class="mdi mdi-currency-usd"></i>
                </span>
                <span> USD ${pricePerMonth} </span>
              </span>
              <span class="icon-text is-block">
                <span class="icon">
                  <i class="mdi mdi-home-heart"></i>
                </span>
                <span> ${numOfRooms} room(s) </span>
              </span>
              <span class="icon-text is-block">
                <span class="icon">
                  <i class="mdi mdi-human-greeting"></i>
                </span>
                <span><a href="mailto:${email}">Contact ${realtorName} (Realtor)</a></span>
              </span>
            </div>
      `,
      };
    };

    onMounted(async () => {
      const map = await (mapRef.value as any).$mapPromise;

      const bounds = new google.value.maps.LatLngBounds();

      await waitUntil(() => Array.isArray(markerRefs.value));

      (markerRefs.value as any).map((markerRef: any) => {
        bounds.extend(markerRef.position);
      });

      map.fitBounds(bounds, 50);
      console.log(map);

      center.value = {
        lat: (boundsValue.value.lat.max + boundsValue.value.lat.min) / 2.0,
        lng: (boundsValue.value.lon.max + boundsValue.value.lon.min) / 2.0,
      };
    });

    return {
      handleMarkerClick,
      center,
      zoom,
      mapRef,
      markerRefs,
      infoOptions,
      infoWindowPos,
    };
  },
});
// export default {
//   data() {
//     return {
//       center: {
//         lat: 48.853,
//         lng: 2.298,
//       },
//       path: [
//         {
//           lat: 48.853,
//           lng: 2.298,
//         },
//         {
//           lat: 48.8735,
//           lng: 2.2951,
//         },
//       ],
//       options: {},
//       userPosition: null,
//       zoom: 12,
//     };
//   },
//   methods: {
//     handleMarkerChanged(e) {
//       console.log(e.latLng.lat());
//       console.log(e.latLng.lng());
//     },
//   },
// };
</script>

<style lang="scss">
.map {
  width: 100%;
  height: 300px;
}
</style>
