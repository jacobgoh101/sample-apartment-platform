<template>
  <div class="mt-5 columns">
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
          <div class="columns">
            <div class="column">
              <ValidationProvider
                name="Longitude"
                rules="required|numeric"
                v-slot="{ errors }"
              >
                <b-field
                  class="mb-3"
                  label="Longitude"
                  :type="errors[0] && 'is-danger'"
                  :message="errors[0]"
                >
                  <b-input type="number" v-model.number="form.longitude" />
                </b-field>
              </ValidationProvider>
            </div>
            <div class="column">
              <ValidationProvider
                name="Latitude"
                rules="required|numeric"
                v-slot="{ errors }"
              >
                <b-field
                  class="mb-3"
                  label="Latitude"
                  :type="errors[0] && 'is-danger'"
                  :message="errors[0]"
                >
                  <b-input type="number" v-model.number="form.latitude" />
                </b-field>
              </ValidationProvider>
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
                v-for="options in realtorOptions || []"
                :value="options.id"
                :key="options.id"
              >
                {{ options.label }}
              </option>
            </b-select>
          </b-field>

          <!--
      realtorId: 0, -->

          <b-field class="mt-5 is-flex is-justify-content-flex-end">
            <button
              type="submit"
              class="button is-primary"
              :class="{ 'is-loading': isLoading }"
              :disabled="invalid"
            >
              Create
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
  watch,
} from '@vue/composition-api';
import { useAdminGuard } from '@/hooks/route.hook.ts';
import { useErrorNitofication } from '@/hooks/error.hook.ts';
import { CreateApartmentDto } from '../types/apartment.types';
import { ROLES } from '../types/roles.types';
import { AxiosError } from 'axios';
import { useRouter } from '../router';
import { useCreateApartment, useGetAllRealtors } from '../hooks/apartment.hook';

export default defineComponent({
  setup() {
    useAdminGuard();

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
    });

    const { isSuccess, isLoading, error, mutate } = useCreateApartment();

    const { data: realtorsData } = useGetAllRealtors();
    const realtorOptions = computed(() =>
      realtorsData.value?.data?.map?.((u) => ({
        id: u.id,
        label: `${u.name} (${u.email})`,
      }))
    );

    const router = useRouter();

    useErrorNitofication(error);

    watch(isSuccess, (isSuccess) => {
      if (isSuccess) router.push({ name: 'ManageApartments' });
    });

    return {
      form,
      mutate,
      handleSubmit() {
        mutate(form);
      },
      isLoading,
      error,
      errorMsg: computed(
        () => (error.value as AxiosError)?.response?.data?.message
      ),
      ROLES,
      realtorOptions,
    };
  },
});
</script>
