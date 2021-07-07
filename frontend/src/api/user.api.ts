import { PagingOption, PagingResult } from '../types/pagination.types';
import { UpdateUserDto, User } from '../types/user.types';
import { $axios } from './axios';

export const getUsersApi = ({ page, limit }: PagingOption) =>
  $axios.get<PagingResult<User>>('/users', {
    params: { page, limit },
  });

export const deleteUserApi = (id: number) =>
  $axios.delete<void>('/users/' + id);

export const updateUserApi = (id: number, body: UpdateUserDto) =>
  $axios.put<User>('/users/' + id, body);

export const findUserByIdApi = (id: number) => $axios.get<User>('/users/' + id);
