import { reactive } from '@vue/composition-api';
import { useMutation } from 'vue-query';
import { verifyEmailApi } from '../api/email-verification-api';

export const useVerifyEmail = () => {
  return useMutation(
    reactive(['verify-email']),
    ({ token, userId }: { token: string; userId: number }) => {
      return verifyEmailApi({ token, userId });
    }
  );
};
