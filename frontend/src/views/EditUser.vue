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
              <b-input type="email" name="email" v-model.trim="form.email" />
            </b-field>
          </ValidationProvider>
          <ValidationProvider
            name="Password"
            rules="min:6"
            v-slot="{ errors }"
            v-if="accountType.includes('Password')"
          >
            <b-field
              class="mb-3"
              label="New Password"
              :type="errors[0] && 'is-danger'"
              :message="
                errors[0] ||
                'Leave it empty to if you aren\'t changing the password.'
              "
            >
              <b-input type="password" v-model="form.password" />
            </b-field>
          </ValidationProvider>
          <br />
          <div class="columns">
            <div class="column">
              <b-field>
                <b-checkbox v-model="form.blocked"> Blocked </b-checkbox>
              </b-field>
            </div>
            <div class="column">
              <b-field>
                <b-checkbox v-model="form.emailVerified">
                  Email Verified
                </b-checkbox>
              </b-field>
            </div>
          </div>
          <b-field class="mb-5" label="Roles">
            <div class="columns">
              <div
                class="column"
                v-for="role in Object.values(ROLES)"
                :key="role"
              >
                <b-checkbox v-model="form.roles" :native-value="role">
                  {{ role }}
                </b-checkbox>
              </div>
            </div>
          </b-field>
          <b-field label="Account Type" class="mb-3">
            {{ accountType }}
          </b-field>
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
import { ROLES } from '../types/roles.types';
import { AxiosError } from 'axios';
import { useRouter } from '../router';
import { useFindUserById, useUpdateUser } from '../hooks/user.hook';
import { once } from 'lodash';

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
      emailVerified: false,
      blocked: false,
      roles: [],
    });

    const setInitialFormValue = once(() => {
      const user = userData.value?.data;
      if (!user) return;
      form.name = user.name;
      form.email = user.email;
      form.emailVerified = user.emailVerified;
      form.blocked = user.blocked;
      form.roles = user.roles || [];
    });
    watch(userData, () => {
      if (userData.value?.data) {
        setInitialFormValue();
      }
    });

    const { isSuccess, isLoading, error, mutate } = useUpdateUser();

    const router = useRouter();

    useErrorNitofication(error);

    watch(isSuccess, (isSuccess) => {
      if (isSuccess) router.push({ name: 'ManageUsers' });
    });

    const accountType = computed(() =>
      userData.value?.data?.googleAccountId
        ? 'Google'
        : userData.value?.data?.facebookAccountId
        ? 'Facebook'
        : 'Email & Password'
    );

    return {
      form,
      accountType,
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
      ROLES,
    };
  },
});
</script>
