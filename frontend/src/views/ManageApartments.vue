<template>
  <div>
    <div class="is-flex is-justify-content-flex-end mb-5">
      <b-button
        type="is-primary"
        icon-left="plus"
        tag="router-link"
        :to="{
          name: 'CreateApartment',
        }"
      >
        Create New Apartment
      </b-button>
    </div>
    <div class="position-relative">
      <b-loading :is-full-page="false" :active="isFetching" />
      <b-table :data="items">
        <template #empty>
          <div class="has-text-centered m-5 p-5">No records</div>
        </template>

        <b-table-column
          field="id"
          label="ID"
          width="40"
          numeric
          v-slot="{ row }"
        >
          {{ row.id }}
        </b-table-column>

        <b-table-column field="name" label="Name" v-slot="{ row }">
          {{ row.name }}
        </b-table-column>

        <b-table-column
          field="floorAreaSquareMeter"
          label="Floor Area (Square Meter)"
          v-slot="{ row }"
        >
          {{ row.floorAreaSquareMeter }}
        </b-table-column>

        <b-table-column
          field="numOfRooms"
          label="Num of Rooms"
          v-slot="{ row }"
        >
          {{ row.numOfRooms }}
        </b-table-column>

        <b-table-column
          field="pricePerMonth"
          label="Price per Month (USD)"
          v-slot="{ row }"
        >
          {{ row.pricePerMonth }}
        </b-table-column>

        <b-table-column field="status" label="Status" v-slot="{ row }">
          {{ row.status && row.status.toLowerCase() }}
        </b-table-column>

        <b-table-column
          field="coordinates"
          label="Coordinates (longitude/latitude)"
          v-slot="{ row }"
        >
          {{ row.longitude }} ,
          {{ row.latitude }}
        </b-table-column>

        <b-table-column
          field="realtor"
          label="Associated Realtor"
          v-slot="{ row }"
        >
          {{ getRealtorName(row.realtorId) }}
        </b-table-column>

        <b-table-column field="status" label="Status" v-slot="{ row }">
          {{ row.status }}
        </b-table-column>

        <b-table-column label="Action" v-slot="{ row: { id } }">
          <div class="buttons">
            <b-button
              type="is-primary"
              size="is-small"
              icon-left="pencil"
              tag="router-link"
              :to="{
                name: 'EditApartment',
                params: {
                  id,
                },
              }"
            >
              Edit
            </b-button>
            <b-button
              type="is-danger"
              size="is-small"
              icon-left="delete"
              @click="handleDeleteApartment(id)"
            >
              Delete
            </b-button>
          </div>
        </b-table-column>
      </b-table>
      <hr />
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
import { computed, defineComponent, ref } from '@vue/composition-api';
import { useRealtorGuard } from '@/hooks/route.hook.ts';
import {
  useDeleteApartmentHandler,
  useApartments,
  useGetAllRealtors,
} from '@/hooks/apartment.hook';

export default defineComponent({
  setup() {
    useRealtorGuard();

    const page = ref(1);
    const limit = ref(10);

    const { data, refetch, isFetching } = useApartments({
      page,
      limit,
    });
    const { data: realtorsData } = useGetAllRealtors();
    const getRealtorName = (realtorId: number) => {
      const realtor = realtorsData?.value?.data?.find(
        (u) => u.id === realtorId
      );
      return realtor?.name;
    };

    const { handleDeleteApartment, onDeleted } = useDeleteApartmentHandler();
    onDeleted(() => refetch.value());

    return {
      items: computed(() => data.value?.data?.items),
      total: computed(() => data.value?.data?.meta?.totalItems),
      limit,
      page,
      handleDeleteApartment,
      getRealtorName,
      isFetching,
    };
  },
});
</script>
