import { SignupDto, User } from '../types/user.types';
import { $axios } from './axios';

export const signupApi = ({ name, password, email }: SignupDto) =>
  $axios.post<User>('/users/register', {
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
  $axios.post<undefined>('/oauth2/google/sessions', { accessToken });

export const facebookLoginApi = ({ accessToken }: { accessToken: string }) =>
  $axios.post<undefined>('/oauth2/facebook/sessions', { accessToken });

export const getMeApi = () => $axios.get<User>('/me');

export const logoutApi = () => $axios.delete<undefined>('/sessions');
