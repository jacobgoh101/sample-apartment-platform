import { getMyRolesApi } from '../api/role.api';
import { ROLES } from '../types/roles.types';
import { computed } from 'vue-demi';
import { useQuery } from 'vue-query';

export const useRoles = () => {
  const query = useQuery(
    'get-my-roles',
    () => getMyRolesApi().catch(() => null),
    {
      retry: 3,
      retryDelay: 0,
      refetchOnWindowFocus: false,
    }
  );
  const roles = computed(
    () => (!query.isError.value && query.data.value?.data) || undefined
  );
  const isLoaded = computed(() => Array.isArray(roles.value));
  const hasAdminRole = computed(
    () => isLoaded.value && roles.value?.includes(ROLES.ADMIN)
  );
  const hasRealtorRole = computed(
    () => isLoaded.value && roles.value?.includes(ROLES.REALTOR)
  );
  const hasClientRole = computed(
    () => isLoaded.value && roles.value?.includes(ROLES.CLIENT)
  );
  const hasNoRole = computed(() => {
    return isLoaded.value && roles.value?.length === 0;
  });
  return {
    ...query,
    roles,
    hasAdminRole,
    hasRealtorRole,
    hasClientRole,
    hasNoRole,
    isLoaded,
  };
};
