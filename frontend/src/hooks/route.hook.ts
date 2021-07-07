import { useRouter } from '../router';
import { useRoles } from './rbac.hook';
import {
  getCurrentInstance,
  onBeforeMount,
  watch,
  watchEffect,
} from '@vue/composition-api';
import Vue from 'vue';
import { NavigationGuard } from 'vue-router';
import { ComponentOptions } from 'vue/types/umd';

export function useRoute() {
  const vm = getCurrentInstance();
  if (!vm) throw new Error('must be called in setup');

  return vm.proxy.$route;
}

export function onHook(
  name: keyof ComponentOptions<Vue>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback: (...args: any) => void
) {
  const vm = getCurrentInstance();
  const merge = Vue.config.optionMergeStrategies[name];
  if (vm && merge) {
    const prototype = Object.getPrototypeOf(vm.proxy.$options);
    prototype[name] = merge(vm.proxy.$options[name], callback);
  }
}

export function onBeforeRouteEnter(callback: NavigationGuard<Vue>) {
  return onHook('beforeRouteEnter', callback);
}

export function onBeforeRouteUpdate(callback: NavigationGuard<Vue>) {
  return onHook('beforeRouteUpdate', callback);
}

export function onBeforeRouteLeave(callback: NavigationGuard<Vue>) {
  return onHook('beforeRouteLeave', callback);
}

export function useRealtorGuard() {
  const { hasRealtorRole, hasAdminRole, isFetching, isSuccess } = useRoles();
  const router = useRouter();
  watchEffect(() => {
    if (
      isSuccess.value &&
      !isFetching.value &&
      !(hasRealtorRole.value || hasAdminRole.value)
    ) {
      return (
        router.currentRoute.name !== 'Home' && router.push({ name: 'Home' })
      );
    }
  });
  return {};
}

export function useAdminGuard() {
  const { hasAdminRole, isFetching, isSuccess } = useRoles();
  const router = useRouter();
  watchEffect(() => {
    if (isSuccess.value && !isFetching.value && !hasAdminRole.value) {
      return (
        router.currentRoute.name !== 'Home' && router.push({ name: 'Home' })
      );
    }
  });
  return {};
}
