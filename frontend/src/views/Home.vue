<template>
  <div>
    <ApartmentFilters
      :pricePerMonth.sync="filters.pricePerMonth"
      :numOfRooms.sync="filters.numOfRooms"
      :floorAreaSquareMeter.sync="filters.floorAreaSquareMeter"
      :status.sync="filters.status"
    />
    <div class="position-relative">
      <b-loading :is-full-page="false" :active="isFetching" />
      <masonry
        :cols="{ default: 4, 1000: 3, 700: 2, 400: 1 }"
        :gutter="{ default: '30px', 700: '15px' }"
      >
        <ApartmentCard
          :item="item"
          v-for="item in items"
          :key="item.id"
          class="mb-5"
        />
      </masonry>
      <b-pagination
        :total="total"
        v-model="page"
        :per-page="limit"
        aria-next-label="Next page"
        aria-previous-label="Previous page"
        aria-page-label="Page"
        aria-current-label="Current page"
      >
      </b-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from '@vue/composition-api';
import NA from '../components/NA.vue';
import { useApartments } from '../hooks/apartment.hook';
import { useAuthenticatedGuard } from '../hooks/route.hook';
import ApartmentCard from '@/components/ApartmentCard.vue';
import ApartmentFilters from '@/components/ApartmentFilters.vue';
import { APARTMENT_STATUS } from '../types/apartment.types';
import { useErrorNotification } from '../hooks/error.hook';

export default defineComponent({
  components: { NA, ApartmentCard, ApartmentFilters },
  setup() {
    useAuthenticatedGuard();

    const page = ref(1);
    const limit = ref(12);
    const filters = reactive({
      floorAreaSquareMeter: [0, Math.pow(10, 8)],
      pricePerMonth: [0, Math.pow(10, 8)],
      numOfRooms: [0, Math.pow(10, 8)],
      status: APARTMENT_STATUS.AVAILABLE,
    });

    const { data, isFetching, error } = useApartments({
      page,
      limit,
      minFloorAreaSquareMeter: computed(() => filters.floorAreaSquareMeter[0]),
      maxFloorAreaSquareMeter: computed(() => filters.floorAreaSquareMeter[1]),
      minPricePerMonth: computed(() => filters.pricePerMonth[0]),
      maxPricePerMonth: computed(() => filters.pricePerMonth[1]),
      minNumOfRooms: computed(() => filters.numOfRooms[0]),
      maxNumOfRooms: computed(() => filters.numOfRooms[1]),
      status: computed(() => filters.status),
    });
    useErrorNotification(error);

    return {
      page,
      limit,
      items: computed(() => data.value?.data?.items),
      total: computed(() => data.value?.data?.meta?.totalItems),
      isFetching,
      filters,
    };
  },
});
</script>

<style lang="scss" scoped></style>
