import { $axios } from './axios';

export const verifyEmailApi = ({
  token,
  userId,
}: {
  token: string;
  userId: number;
}) => $axios.put<undefined>('/email-verifications/verify', { token, userId });
