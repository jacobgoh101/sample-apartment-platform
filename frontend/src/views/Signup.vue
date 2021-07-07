<template>
  <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-5-tablet is-4-desktop is-3-widescreen">
            <b-notification v-if="error" type="is-danger" :closable="false">
              {{ errMsg || (error && error.message) }}
            </b-notification>
            <ValidationObserver v-slot="{ pristine, invalid }" slim>
              <form class="box" @submit.prevent="mutate">
                <ValidationProvider
                  name="Email"
                  rules="required|email"
                  v-slot="{ errors }"
                >
                  <b-field
                    label="Email"
                    :type="errors[0] && 'is-danger'"
                    :message="errors[0]"
                  >
                    <b-input type="email" v-model.trim="email" />
                  </b-field>
                </ValidationProvider>
                <ValidationProvider
                  name="Password"
                  rules="required|min:6"
                  v-slot="{ errors }"
                >
                  <b-field
                    class="mt-3"
                    label="Password"
                    :type="errors[0] && 'is-danger'"
                    :message="errors[0]"
                  >
                    <b-input type="password" v-model="password" />
                  </b-field>
                </ValidationProvider>
                <ValidationProvider
                  name="Name"
                  rules="required|min:3"
                  v-slot="{ errors }"
                >
                  <b-field
                    class="mt-3"
                    label="Name"
                    :type="errors[0] && 'is-danger'"
                    :message="errors[0]"
                  >
                    <b-input v-model="name" name="name" />
                  </b-field>
                </ValidationProvider>
                <b-field class="mt-5 is-flex is-justify-content-flex-end">
                  <button
                    type="submit"
                    class="button is-primary is-fullwidth"
                    :class="{ 'is-loading': isLoading }"
                    :disabled="pristine || invalid"
                  >
                    Sign Up
                  </button>
                </b-field>

                <div class="is-divider" data-content="OR"></div>

                <a class="button is-google is-fullwidth" title=".is-google">
                  <span class="icon">
                    <i class="fab fa-google"></i>
                  </span>
                  <span>Sign up with Google</span>
                </a>
                <a class="button is-github is-fullwidth" title=".is-github">
                  <span class="icon">
                    <i class="fab fa-github"></i>
                  </span>
                  <span>Sign up with Github</span>
                </a>
              </form>
            </ValidationObserver>
            <div class="is-flex is-justify-content-center">
              Already have an account?
              <router-link :to="{ name: 'Login' }" class="pl-1">
                Sign in
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api';
import {
  useAfterAuthRedirection,
  useSignup,
} from '@/hooks/authentication.hook';
import { AxiosError } from 'axios';

export default defineComponent({
  setup() {
    const email = ref<string>('');
    const name = ref<string>('');
    const password = ref<string>('');

    const { isLoading, isSuccess, error, mutate } = useSignup({
      name,
      password,
      email,
    });
    useAfterAuthRedirection(isSuccess);

    const errMsg = computed(() => {
      return (error.value as AxiosError)?.response?.data?.message;
    });

    return {
      email,
      name,
      password,
      isLoading,
      isSuccess,
      error,
      mutate,
      errMsg,
    };
  },
});
</script>

<style lang="scss" scoped>
.button.is-google {
  margin-bottom: 10px;
}
</style>
