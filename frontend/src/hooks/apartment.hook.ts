import { PagingOption } from '../types/pagination.types';
import { ToRefs, reactive, watch, Ref, computed } from 'vue-demi';
import { useQuery, useMutation } from 'vue-query';
import { UseQueryOptions } from 'react-query';
import {
  createApartmentApi,
  deleteApartmentApi,
  findApartmentByIdApi,
  findApartmentsByRealtorIdApi,
  getAllRealtorsApi,
  getApartmentsApi,
  updateApartmentApi,
} from '../api/apartment.api';
import { createEventHook } from '@vueuse/core';
import {
  CreateApartmentDto,
  UpdateApartmentDto,
  Apartment,
  FindApartmentQueryDto,
} from '../types/apartment.types';
import { AxiosResponse } from 'axios';
import { fetchOnceQueryOption } from './util.hook';

export const useApartments = (
  params: ToRefs<PagingOption & FindApartmentQueryDto>
) => {
  return useQuery(reactive(['get-apartment', params]), () =>
    getApartmentsApi(reactive(params))
  );
};

export const useDeleteApartment = () => {
  return useMutation('delete-Apartment', (id: number) =>
    deleteApartmentApi(id)
  );
};

export const useDeleteApartmentHandler = () => {
  const deleted = createEventHook<void>();

  const {
    mutate: deleteMutate,
    isSuccess: isDeleteSuccess,
  } = useDeleteApartment();

  watch(isDeleteSuccess, (v) => {
    if (v) {
      deleted.trigger();
    }
  });

  const handleDeleteApartment = (id: number) => {
    if (
      !confirm(
        `Are you sure you want to permanently remove this apartment and all its content?`
      )
    )
      return;
    deleteMutate(id);
  };
  return {
    handleDeleteApartment,
    onDeleted: deleted.on,
  };
};

export const useUpdateApartment = () => {
  return useMutation(
    'update-apartment',
    ({ id, body }: { id: number; body: UpdateApartmentDto }) => {
      return updateApartmentApi(id, body);
    }
  );
};

export const useCreateApartment = () => {
  return useMutation('create-apartment', (body: CreateApartmentDto) => {
    return createApartmentApi(body);
  });
};

export const useFindApartmentById = (
  id: Ref<number>,
  options?: UseQueryOptions<AxiosResponse<Apartment>>
) => {
  return useQuery(
    reactive(['find-apartment-by-id', id]),
    () => findApartmentByIdApi(id.value),
    options
  );
};

export const useGetAllRealtors = () => {
  return useQuery(reactive(['get-all-realtors']), () => getAllRealtorsApi());
};

export const useFindApartmentByRealtorId = (id: Ref<number>) => {
  return useQuery(
    reactive(['find-apartments-by-realtor-id', id]),
    () => findApartmentsByRealtorIdApi(id.value),
    reactive({
      ...fetchOnceQueryOption,
      enabled: computed(() => !!id.value),
    })
  );
};
