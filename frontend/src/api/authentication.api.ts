import { SignupDto, User } from '../types/user.types';
import { $axios } from './axios';

export const signupApi = ({ name, password, email }: SignupDto) =>
  $axios.post<User>('/users', {
    name,
    password,
    email,
  });

export const loginApi = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => $axios.post<undefined>('/sessions', { email, password });

export const googleLoginApi = ({ accessToken }: { accessToken: string }) =>
  $axios.post<undefined>('/sessions/social/google', { accessToken });

export const facebookLoginApi = ({ accessToken }: { accessToken: string }) =>
  $axios.post<undefined>('/sessions/social/facebook', { accessToken });

export const getMeApi = () => $axios.get<User>('/me');

export const logoutApi = () => $axios.delete<undefined>('/sessions');
