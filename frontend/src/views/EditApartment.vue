<template>
  <div class="mt-5 columns">
    <b-loading is-full-page :active="isFetchingApartment" />
    <div class="column is-6-desktop is-offset-3-desktop">
      <ValidationObserver v-slot="{ invalid }" slim>
        <form class="box" @submit.prevent="handleSubmit">
          <ValidationProvider
            name="Name"
            rules="required|min:3"
            v-slot="{ errors }"
          >
            <b-field
              class="mb-3"
              label="Name"
              :type="errors[0] && 'is-danger'"
              :message="errors[0]"
            >
              <b-input v-model="form.name" name="name" />
            </b-field>
          </ValidationProvider>
          <ValidationProvider
            name="Description"
            rules="required|min:3|max:2000"
            v-slot="{ errors }"
          >
            <b-field
              class="mb-3"
              label="Description"
              :type="errors[0] && 'is-danger'"
              :message="errors[0]"
            >
              <b-input type="textarea" v-model.trim="form.description" />
            </b-field>
          </ValidationProvider>
          <ValidationProvider
            name="Floor Area Size in Square Meter"
            rules="required|min_value:1|integer"
            v-slot="{ errors }"
          >
            <b-field
              class="mb-3"
              label="Floor Area Size in Square Meter"
              :type="errors[0] && 'is-danger'"
              :message="errors[0]"
            >
              <b-input
                type="number"
                min="0"
                v-model.number="form.floorAreaSquareMeter"
              />
            </b-field>
          </ValidationProvider>
          <ValidationProvider
            name="Price Per Month (USD)"
            rules="required|min_value:1|numeric"
            v-slot="{ errors }"
          >
            <b-field
              class="mb-3"
              label="Price Per Month (USD)"
              :type="errors[0] && 'is-danger'"
              :message="errors[0]"
            >
              <b-input
                type="number"
                min="0"
                v-model.number="form.pricePerMonth"
              />
            </b-field>
          </ValidationProvider>
          <ValidationProvider
            name="Number of Rooms"
            rules="required|min_value:1|integer"
            v-slot="{ errors }"
          >
            <b-field
              class="mb-3"
              label="Number of Rooms"
              :type="errors[0] && 'is-danger'"
              :message="errors[0]"
            >
              <b-input type="number" min="0" v-model.number="form.numOfRooms" />
            </b-field>
          </ValidationProvider>

          <div class="columns is-multiline is-mobile">
            <div class="column">
              <ValidationProvider
                name="Longitude"
                rules="required|between:-180.999999,180.999999"
                v-slot="{ errors }"
              >
                <b-field
                  label="Longitude"
                  :type="errors[0] && 'is-danger'"
                  :message="errors[0]"
                >
                  <b-input
                    type="text"
                    v-model.number="form.longitude"
                    name="longitude"
                    :disabled="searchLocationEnabled"
                  />
                </b-field>
              </ValidationProvider>
            </div>
            <div class="column">
              <ValidationProvider
                name="Latitude"
                rules="required|between:-90,90"
                v-slot="{ errors }"
              >
                <b-field
                  label="Latitude"
                  :type="errors[0] && 'is-danger'"
                  :message="errors[0]"
                >
                  <b-input
                    type="text"
                    v-model.number="form.latitude"
                    name="latitude"
                    :disabled="searchLocationEnabled"
                  />
                </b-field>
              </ValidationProvider>
            </div>
            <div class="column is-12">
              <b-field class="mb-3" label="Location">
                <LocationSearch
                  @select="handleLocationSelect"
                  :disabled="!searchLocationEnabled"
                  :key="searchLocationEnabled"
                />
              </b-field>
            </div>
            <div class="column is-12">
              <b-checkbox v-model="searchLocationEnabled" class="mb-3">
                Search Location
              </b-checkbox>
            </div>
          </div>

          <b-field label="Associated Realtor">
            <b-select
              placeholder="Select a Realtor"
              :loading="!realtorOptions"
              expanded
              v-model="form.realtorId"
            >
              <option
                v-for="option in realtorOptions || []"
                :value="option.id"
                :key="option.id"
              >
                {{ option.label }}
              </option>
            </b-select>
          </b-field>

          <b-field label="Status">
            <b-select
              placeholder="Select a Status"
              expanded
              v-model="form.status"
            >
              <option
                v-for="option in statusOptions"
                :value="option"
                :key="option"
              >
                {{ option }}
              </option>
            </b-select>
          </b-field>

          <b-field class="mt-5 is-flex is-justify-content-flex-end">
            <button
              type="submit"
              class="button is-primary"
              :class="{ 'is-loading': isLoading }"
              :disabled="invalid"
            >
              Save
            </button>
          </b-field>
        </form>
      </ValidationObserver>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  ref,
  watch,
} from '@vue/composition-api';
import { useRealtorGuard, useRoute } from '@/hooks/route.hook.ts';
import { useErrorNotification } from '@/hooks/error.hook.ts';
import { APARTMENT_STATUS, CreateApartmentDto } from '../types/apartment.types';
import { ROLES } from '../types/roles.types';
import { AxiosError } from 'axios';
import { useRouter } from '../router';
import {
  useFindApartmentById,
  useGetAllRealtors,
  useUpdateApartment,
} from '../hooks/apartment.hook';
import { once } from 'lodash';
import LocationSearch from '@/components/LocationSearch.vue';
import { Coordinate } from '../types/geo-coding.types';

export default defineComponent({
  components: { LocationSearch },
  setup() {
    useRealtorGuard();

    const route = useRoute();
    const id = computed(() => +route.params?.id);
    const {
      data: apartmentData,
      isFetching: isFetchingApartment,
    } = useFindApartmentById(id);

    const form = reactive<CreateApartmentDto>({
      name: '',
      description: '',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      floorAreaSquareMeter: null,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      pricePerMonth: null,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      numOfRooms: null,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      longitude: null,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      latitude: null,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      realtorId: null,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      status: null,
    });
    const searchLocationEnabled = ref(false);

    const handleLocationSelect = (place: Coordinate) => {
      if (!(place?.lon && place?.lat)) return;
      form.longitude = +place.lon;
      form.latitude = +place.lat;
    };

    const { data: realtorsData } = useGetAllRealtors();
    const realtorOptions = computed(() =>
      realtorsData.value?.data?.map?.((u) => ({
        id: u.id,
        label: `${u.name} (${u.email})`,
      }))
    );
    const statusOptions = computed(() => Object.values(APARTMENT_STATUS));

    const setInitialFormValue = once(() => {
      const apartment = apartmentData.value?.data;
      if (!apartment) return;
      form.name = apartment.name;
      form.description = apartment.description;
      form.floorAreaSquareMeter = apartment.floorAreaSquareMeter;
      form.pricePerMonth = apartment.pricePerMonth;
      form.numOfRooms = apartment.numOfRooms;
      form.longitude = apartment.longitude;
      form.latitude = apartment.latitude;
      form.realtorId = apartment.realtorId;
      form.status = apartment.status;
    });
    watch(apartmentData, () => {
      if (apartmentData.value?.data) {
        setInitialFormValue();
      }
    });

    const { isSuccess, isLoading, error, mutate } = useUpdateApartment();
    const router = useRouter();

    useErrorNotification(error);

    watch(isSuccess, (isSuccess) => {
      if (isSuccess) router.push({ name: 'ManageApartments' });
    });

    return {
      form,
      mutate,
      handleSubmit() {
        mutate({ id: id.value, body: form });
      },
      isLoading,
      error,
      errorMsg: computed(
        () => (error.value as AxiosError)?.response?.data?.message
      ),
      ROLES,
      realtorOptions,
      isFetchingApartment,
      handleLocationSelect,
      searchLocationEnabled,
      statusOptions,
    };
  },
});
</script>
