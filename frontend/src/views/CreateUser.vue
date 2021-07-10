<template>
  <div class="mt-5 columns">
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
          <ValidationProvider name="Password" rules="min:6" v-slot="{ errors }">
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
import { useAdminGuard } from '@/hooks/route.hook.ts';
import { useErrorNitofication } from '@/hooks/error.hook.ts';
import { CreateUserDto } from '../types/user.types';
import { ROLES } from '../types/roles.types';
import { AxiosError } from 'axios';
import { useRouter } from '../router';
import { useCreateUser } from '../hooks/user.hook';

export default defineComponent({
  setup() {
    useAdminGuard();

    const form = reactive<CreateUserDto>({
      name: '',
      password: '',
      email: '',
      emailVerified: true,
      blocked: false,
      roles: [],
    });

    const { isSuccess, isLoading, error, mutate } = useCreateUser();

    const router = useRouter();

    useErrorNitofication(error);

    watch(isSuccess, (isSuccess) => {
      if (isSuccess) router.push({ name: 'ManageUsers' });
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
    };
  },
});
</script>
