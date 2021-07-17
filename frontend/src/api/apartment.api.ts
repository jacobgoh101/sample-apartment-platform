import { PagingOption, PagingResult } from '../types/pagination.types';
import {
  CreateApartmentDto,
  UpdateApartmentDto,
  Apartment,
  FindApartmentQueryDto,
} from '../types/apartment.types';
import { $axios } from './axios';
import { User } from '../types/user.types';

export const getApartmentsApi = (
  params: PagingOption & FindApartmentQueryDto
) =>
  $axios.get<PagingResult<Apartment>>('/apartments', {
    params,
  });

export const deleteApartmentApi = (id: number) =>
  $axios.delete<void>('/apartments/' + id);

export const updateApartmentApi = (id: number, body: UpdateApartmentDto) =>
  $axios.put<Apartment>('/apartments/' + id, body);

export const createApartmentApi = (body: CreateApartmentDto) =>
  $axios.post<Apartment>('/apartments', body);

export const findApartmentByIdApi = (id: number) =>
  $axios.get<Apartment>('/apartments/' + id);

export const getAllRealtorsApi = () => $axios.get<User[]>('/realtors/');

export const findApartmentsByRealtorIdApi = (id: number) =>
  $axios.get<Apartment[]>(`/realtors/${id}/apartments`);
