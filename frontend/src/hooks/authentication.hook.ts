import {
  getMeApi,
  loginApi,
  logoutApi,
  signupApi,
} from '../api/authentication.api';
import { useRoles } from './rbac.hook';
import { computed, reactive, Ref, watch } from 'vue-demi';
import { useQuery, useMutation } from 'vue-query';
import { useRouter } from '../router';

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
  return useMutation('logout', () => logoutApi(), {
    onSuccess() {
      refreshAuth();
    },
  });
};

export const useAfterAuthRedirection = (
  isLoginOrSignupSuccess: Ref<boolean>
) => {
  const router = useRouter();
  const { isLoaded, hasRealtorRole, isFetching } = useRoles();
  const unwatch = watch(
    [isLoginOrSignupSuccess, isLoaded, isFetching],
    ([isLoginOrSignupSuccess, isLoaded, isFetching]) => {
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
