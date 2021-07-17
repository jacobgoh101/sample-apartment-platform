<template>
  <googlemaps-map ref="map" class="map" :center.sync="center" :zoom.sync="zoom">
    <!-- Marker -->
    <googlemaps-marker
      title="Paris"
      :draggable="true"
      :position="{ lat: 48.8735, lng: 2.2951 }"
      @dragend="handleMarkerChanged"
    />
  </googlemaps-map>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';

export default defineComponent({
  props: { longitude: Number, latitude: Number },
  setup(props, { emit }) {
    const center = ref({
      lat: props.latitude || 0,
      lng: props.longitude || 0,
    });
    const zoom = ref(12);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleMarkerChanged = (e: any) => {
      const newLongitude = e.latLng.lat();
      const newLatitude = e.latLng.lng();
      emit('update:longitude', newLongitude);
      emit('update:latitude', newLatitude);
    };

    return { handleMarkerChanged, center, zoom };
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
