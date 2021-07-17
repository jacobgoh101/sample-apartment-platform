<template>
  <div class="columns is-multiline is-mobile">
    <div class="column is-12-mobile is-6-tablet is-4-desktop">
      <div class="px-2">
        <b-field label="Size (SQM)">
          <b-slider
            v-model="floorAreaSquareMeterSynced"
            :min="0"
            :max="1000"
            :step="50"
            lazy
          >
          </b-slider>
        </b-field>
      </div>
    </div>
    <div class="column is-12-mobile is-6-tablet is-4-desktop">
      <div class="px-2">
        <b-field label="Price Per Month">
          <b-slider
            v-model="pricePerMonthSynced"
            :min="0"
            :max="20000"
            :step="100"
            lazy
          >
          </b-slider>
        </b-field>
      </div>
    </div>
    <div class="column is-12-mobile is-6-tablet is-4-desktop">
      <div class="px-2">
        <b-field label="Number Of Rooms">
          <b-slider
            v-model="numOfRoomsSynced"
            :min="1"
            :max="30"
            :step="1"
            lazy
          >
          </b-slider>
        </b-field>
      </div>
    </div>
    <div class="column is-12" v-if="hasRealtorRole || hasAdminRole">
      <b-radio
        v-model="statusSynced"
        :native-value="APARTMENT_STATUS.AVAILABLE"
      >
        {{ APARTMENT_STATUS.AVAILABLE }}
      </b-radio>
      <b-radio v-model="statusSynced" :native-value="APARTMENT_STATUS.RENTED">
        {{ APARTMENT_STATUS.RENTED }}
      </b-radio>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api';
import { useRoles } from '../hooks/rbac.hook';
import { APARTMENT_STATUS } from '../types/apartment.types';

export default defineComponent<{
  floorAreaSquareMeter: Array<number>;
  pricePerMonth: Array<number>;
  numOfRooms: Array<number>;
  status: APARTMENT_STATUS;
}>({
  props: {
    floorAreaSquareMeter: Array,
    pricePerMonth: Array,
    numOfRooms: Array,
    status: String,
  },
  setup(props, { emit }) {
    const { hasRealtorRole, hasAdminRole } = useRoles();

    const floorAreaSquareMeterSynced = computed({
      get() {
        return props.floorAreaSquareMeter;
      },
      set(v) {
        emit('update:floorAreaSquareMeter', v);
      },
    });
    const pricePerMonthSynced = computed({
      get() {
        return props.pricePerMonth;
      },
      set(v) {
        emit('update:pricePerMonth', v);
      },
    });
    const numOfRoomsSynced = computed({
      get() {
        return props.numOfRooms;
      },
      set(v) {
        emit('update:numOfRooms', v);
      },
    });
    const statusSynced = computed({
      get() {
        return props.status;
      },
      set(v) {
        emit('update:status', v);
      },
    });

    return {
      floorAreaSquareMeterSynced,
      pricePerMonthSynced,
      numOfRoomsSynced,
      statusSynced,
      APARTMENT_STATUS,
      hasRealtorRole,
      hasAdminRole,
    };
  },
});
</script>

<style lang="scss" scoped></style>
