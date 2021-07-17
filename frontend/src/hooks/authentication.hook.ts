import {
  facebookLoginApi,
  getMeApi,
  googleLoginApi,
  loginApi,
  logoutApi,
  signupApi,
} from '../api/authentication.api';
import { useRoles } from './rbac.hook';
import { computed, ComputedRef, reactive, Ref, watch } from 'vue-demi';
import { useQuery, useMutation } from 'vue-query';
import { useRouter } from '../router';
import { useClearSocialSession } from './hellojs.hook';
import { DialogProgrammatic } from 'buefy';
import { watchEffect } from '@vue/composition-api';

export const useSignup = ({
  name,
  password,
  email,
}: {
  name: Ref<string>;
  password: Ref<string>;
  email: Ref<string>;
}) => {
  const { refreshAuth } = useAuth();
  return useMutation(
    reactive(['signup', name, password, email]),
    () => {
      return signupApi({
        name: name.value,
        password: password.value,
        email: email.value,
      });
    },
    {
      retry: false,
      onSuccess() {
        refreshAuth();
      },
    }
  );
};

export const useLogin = ({
  email,
  password,
}: {
  email: Ref<string>;
  password: Ref<string>;
}) => {
  const { refreshAuth } = useAuth();
  return useMutation(
    reactive(['login', name, password]),
    () => {
      return loginApi({ email: email.value, password: password.value });
    },
    {
      retry: false,
      onSuccess() {
        refreshAuth();
      },
    }
  );
};

export const useCreateSessionFromGoogleLogin = () => {
  const { refreshAuth } = useAuth();
  return useMutation(
    reactive(['google-login']),
    (accessToken: string) => {
      return googleLoginApi({ accessToken });
    },
    {
      retry: false,
      onSuccess() {
        refreshAuth();
      },
    }
  );
};
export const useCreateSessionFromFacebookLogin = () => {
  const { refreshAuth } = useAuth();
  return useMutation(
    reactive(['facebook-login']),
    (accessToken: string) => {
      return facebookLoginApi({ accessToken });
    },
    {
      retry: false,
      onSuccess() {
        refreshAuth();
      },
    }
  );
};

export const useMe = () => {
  return useQuery(
    'get-me',
    () => {
      return getMeApi().catch(() => null);
    },
    { retry: 3, retryDelay: 0 }
  );
};

export const useAuth = () => {
  const { data, refetch: refetchMe, isError } = useMe();
  const { refetch: refetchRole } = useRoles();
  const isLoggedIn = computed(() => !isError.value && !!data.value?.data?.id);
  const user = computed(() => !isError.value && data.value?.data);

  return {
    isLoggedIn,
    user,
    refreshAuth() {
      refetchMe.value();
      refetchRole.value();
    },
  };
};

export const useLogout = () => {
  const { refreshAuth } = useAuth();
  const { clear } = useClearSocialSession();
  return useMutation('logout', () => logoutApi(), {
    onSuccess() {
      clear();
      refreshAuth();
    },
  });
};

export const useAfterAuthRedirection = (
  isLoginOrSignupSuccess: Ref<boolean>,
  emailVerified: ComputedRef<boolean | undefined>
) => {
  const router = useRouter();
  const { isLoaded, hasRealtorRole, isFetching } = useRoles();
  const unwatch = watch(
    [isLoginOrSignupSuccess, isLoaded, isFetching, emailVerified],
    ([isLoginOrSignupSuccess, isLoaded, isFetching, emailVerified]) => {
      if (emailVerified === false) {
        return;
      }
      if (isLoginOrSignupSuccess && isLoaded && !isFetching) {
        unwatch();
        if (hasRealtorRole.value) {
          router.push({ name: 'ManageMyApartments' });
        } else {
          router.push({ name: 'Home' });
        }
      }
    }
  );
  return {};
};

export function useRoleValidityChecker() {
  const { isLoggedIn } = useAuth();
  const { isFetching, isSuccess, hasNoRole } = useRoles();
  const isReady = computed(() => isSuccess.value && !isFetching.value);
  const unwatch = watchEffect(() => {
    if (isReady.value) {
      if (isLoggedIn.value && hasNoRole.value) {
        unwatch();
        DialogProgrammatic.alert(
          `Your account's roles are invalid. Please contact support@apartmentrental.com `
        );
        return;
      }
    }
  });
  return { hasNoRole };
}
