import { AxiosError } from 'axios';
import { NotificationProgrammatic } from 'buefy';
import { watchEffect, Ref } from 'vue-demi';

export const useErrorNotification = (error: Ref<unknown>) => {
  watchEffect(() => {
    const errMsg =
      (error.value as AxiosError)?.response?.data?.message ||
      (error.value as Error)?.message;
    if (errMsg)
      NotificationProgrammatic.open({
        duration: 5000,
        message: errMsg,
        type: 'is-danger',
        hasIcon: true,
        queue: false,
      });
  });
};
