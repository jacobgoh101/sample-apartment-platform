<template>
  <div class="mt-5 columns">
    <b-loading is-full-page :active="isFetchingUser" />
    <div class="column is-6-desktop is-offset-3-desktop">
      <ValidationObserver v-slot="{}" slim>
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
            name="Email"
            rules="required|email"
            v-slot="{ errors }"
          >
            <b-field
              class="mb-3"
              label="Email"
              :type="errors[0] && 'is-danger'"
              :message="errors[0]"
            >
              <b-input type="email" v-model.trim="form.email" />
            </b-field>
          </ValidationProvider>
          <ValidationProvider
            name="Password"
            rules="required|min:6"
            v-slot="{ errors }"
          >
            <b-field
              class="mb-3"
              label="New Password"
              :type="errors[0] && 'is-danger'"
              :message="errors[0]"
            >
              <b-input type="password" v-model="form.password" />
            </b-field>
          </ValidationProvider>
          <b-field class="mt-5 is-flex is-justify-content-flex-end">
            <button
              type="submit"
              class="button is-primary"
              :class="{ 'is-loading': isLoading }"
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
  watch,
} from '@vue/composition-api';
import { useAdminGuard, useRoute } from '@/hooks/route.hook.ts';
import { useErrorNitofication } from '@/hooks/error.hook.ts';
import { UpdateUserDto } from '../types/user.types';
import { AxiosError } from 'axios';
import { useRouter } from '../router';
import { useFindUserById, useUpdateUser } from '../hooks/user.hook';

export default defineComponent({
  setup() {
    useAdminGuard();

    const route = useRoute();
    const id = computed(() => +route.params?.id);
    const { data: userData, isFetching: isFetchingUser } = useFindUserById(id);

    const form = reactive<UpdateUserDto>({
      name: '',
      password: '',
      email: '',
    });

    watch(userData, () => {
      const user = userData.value?.data;
      if (userData.value?.data) {
        form.name = user?.name || form.name;
        form.email = user?.email || form.email;
      }
    });

    const { isSuccess, isLoading, error, mutate } = useUpdateUser();

    const router = useRouter();

    useErrorNitofication(error);

    watch(isSuccess, (isSuccess) => {
      if (isSuccess) router.push({ name: 'ManageUsers' });
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
      isFetchingUser,
    };
  },
});
</script>
