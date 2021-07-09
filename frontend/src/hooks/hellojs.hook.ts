import hello, { HelloJSAuthResponse } from 'hellojs';
import { createEventHook } from '@vueuse/core';
import { GoogleProfile } from '../types/hellojs.types';
import { onUnmounted } from 'vue-demi';
import {
  useCreateSessionFromFacebookLogin,
  useCreateSessionFromGoogleLogin,
} from './authentication.hook';

interface SocialLoginSuccessPayload {
  profile: GoogleProfile;
  session: HelloJSAuthResponse;
  network: 'google' | 'facebook';
}

const socialLoginSuccess = createEventHook<SocialLoginSuccessPayload>();

hello.init(
  {
    google: process.env.VUE_APP_GOOGLE_OAUTH2_CLIENT_ID,
    facebook: process.env.VUE_APP_FACEBOOK_OAUTH2_CLIENT_ID,
  },
  { redirect_uri: 'oauth2/callback' }
);

hello.on('auth.login', async (auth) => {
  // Call user information, for the given network
  const profile = await hello(auth.network).api('me');
  const session = hello(auth.network).getAuthResponse();
  socialLoginSuccess.trigger({
    profile,
    session,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    network: auth.network,
  });
});

export const useSocialLogin = () => {
  const googleLogin = () => {
    hello('google').login({ scope: 'email' });
  };
  const facebookLogin = () => {
    hello('facebook').login({
      scope: 'email',
    });
  };

  const {
    mutate: createSessionFromGoogleToken,
    isSuccess: isGoogleLoginSuccess,
  } = useCreateSessionFromGoogleLogin();
  const {
    mutate: createSessionFromFacebookToken,
    isSuccess: isFacebookLoginSuccess,
  } = useCreateSessionFromFacebookLogin();

  const handleSocialAuthResp = (resp: SocialLoginSuccessPayload) => {
    console.log(resp, 'handleSocialAuthResp');
    resp.network === 'google' &&
      createSessionFromGoogleToken(resp.session.access_token || '');
    resp.network === 'facebook' &&
      createSessionFromFacebookToken(resp.session.access_token || '');
  };
  socialLoginSuccess.on(handleSocialAuthResp);
  onUnmounted(() => {
    socialLoginSuccess.off(handleSocialAuthResp);
  });

  return {
    googleLogin,
    facebookLogin,
    isGoogleLoginSuccess,
    isFacebookLoginSuccess,
  };
};

export const useClearSocialSession = () => {
  const clear = () => {
    hello('google').logout();
    hello('facebook').logout();
  };
  return { clear };
};
