import hello, { HelloJSAuthResponse } from 'hellojs';
import { createEventHook } from '@vueuse/core';
import { GoogleProfile } from '../types/hellojs.types';

const loginSuccess = createEventHook<{
  profile: GoogleProfile;
  session: HelloJSAuthResponse;
}>();

hello.init(
  {
    google: process.env.VUE_APP_GOOGLE_OAUTH2_CLIENT_ID,
  },
  { redirect_uri: 'oauth2/callback' }
);

hello.on('auth.login', async (auth) => {
  // Call user information, for the given network
  const profile = await hello(auth.network).api('me');
  const session = hello(auth.network).getAuthResponse();
  loginSuccess.trigger({ profile, session });
});

export const useSocialLogin = () => {
  const googleLogin = () => {
    hello('google').login({ scope: 'email' });
  };

  return { googleLogin, onSuccess: loginSuccess.on };
};

export const useClearSocialSession = () => {
  const clear = () => {
    hello('google').logout();
  };
  return { clear };
};
