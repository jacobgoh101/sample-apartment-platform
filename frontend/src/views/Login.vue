<template>
  <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-5-tablet is-4-desktop is-3-widescreen">
            <b-notification v-if="error" type="is-danger" :closable="false">
              Invalid email or password
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
                    <b-input v-model.trim="email" type="email" name="email" />
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
                <b-field class="mt-5 is-flex is-justify-content-flex-end">
                  <button
                    type="submit"
                    class="button is-primary is-fullwidth"
                    :class="{ 'is-loading': isLoading }"
                    :disabled="pristine || invalid"
                  >
                    Login
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
                  <span>Sign in with Google</span>
                </a>
                <a
                  class="button is-facebook is-fullwidth"
                  title=".is-facebook"
                  @click="facebookLogin"
                >
                  <span class="icon">
                    <i class="fab fa-facebook"></i>
                  </span>
                  <span>Sign in with Facebook</span>
                </a>
              </form>
            </ValidationObserver>

            <div class="is-flex is-justify-content-center">
              Don't have an account?
              <router-link :to="{ name: 'Signup' }" class="pl-1">
                Sign up
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api';
import { useAfterAuthRedirection, useLogin } from '@/hooks/authentication.hook';
import { useSocialLogin } from '@/hooks/hellojs.hook';
import { useSome } from '../hooks/util.hook';

export default defineComponent({
  setup() {
    const email = ref<string>('');
    const password = ref<string>('');

    const {
      isLoading,
      isSuccess: isNormalLoginSuccess,
      error,
      mutate,
    } = useLogin({
      email,
      password,
    });

    const {
      googleLogin,
      facebookLogin,
      isGoogleLoginSuccess,
      isFacebookLoginSuccess,
    } = useSocialLogin();

    useAfterAuthRedirection(
      useSome(
        isNormalLoginSuccess,
        isGoogleLoginSuccess,
        isFacebookLoginSuccess
      )
    );

    return {
      email,
      password,
      isLoading,
      error,
      mutate,
      googleLogin,
      facebookLogin,
    };
  },
});
</script>

<style lang="scss" scoped>
.button.is-google {
  margin-bottom: 10px;
}
</style>
