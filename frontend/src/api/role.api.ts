import { ROLES } from '../types/roles.types';
import { $axios } from './axios';

export const getMyRolesApi = () => $axios.get<ROLES[]>('/roles');
