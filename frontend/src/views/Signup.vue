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
                    <b-input type="email" name="email" v-model.trim="email" />
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

                <a
                  class="button is-google is-fullwidth"
                  title=".is-google"
                  @click="googleLogin"
                >
                  <span class="icon">
                    <i class="fab fa-google"></i>
                  </span>
                  <span>Sign up with Google</span>
                </a>
                <a
                  class="button is-facebook is-fullwidth"
                  title=".is-facebook"
                  @click="facebookLogin"
                >
                  <span class="icon">
                    <i class="fab fa-facebook"></i>
                  </span>
                  <span>Sign up with Facebook</span>
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
import { defineComponent, ref, computed, watch } from '@vue/composition-api';
import {
  useAfterAuthRedirection,
  useSignup,
} from '@/hooks/authentication.hook';
import { useSome } from '@/hooks/util.hook';
import { AxiosError } from 'axios';
import { useSocialLogin } from '../hooks/hellojs.hook';
import { DialogProgrammatic } from 'buefy';
import { useRouter } from '../router';

export default defineComponent({
  setup() {
    const router = useRouter();
    const email = ref<string>('');
    const name = ref<string>('');
    const password = ref<string>('');

    const {
      isLoading,
      isSuccess: isSignupSuccess,
      error,
      mutate,
      data: user,
    } = useSignup({
      name,
      password,
      email,
    });

    const {
      googleLogin,
      facebookLogin,
      isGoogleLoginSuccess,
      isFacebookLoginSuccess,
    } = useSocialLogin();

    useAfterAuthRedirection(
      useSome(isSignupSuccess, isGoogleLoginSuccess, isFacebookLoginSuccess),
      computed(() => user.value?.data?.emailVerified)
    );

    const errMsg = computed(() => {
      return (error.value as AxiosError)?.response?.data?.message;
    });

    const isPendingEmailVerification = computed(
      () => user.value?.data?.emailVerified === false
    );
    watch(
      isPendingEmailVerification,
      (isPendingEmailVerification) => {
        if (isPendingEmailVerification) {
          DialogProgrammatic.alert({
            message:
              'A verification link has been sent to your email account. Please click on the link that has just been sent to your email account to verify your email and continue the registration process.',
          });
          router.push('/');
        }
      },
      { immediate: true }
    );

    return {
      email,
      name,
      password,
      isLoading,
      googleLogin,
      facebookLogin,
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
