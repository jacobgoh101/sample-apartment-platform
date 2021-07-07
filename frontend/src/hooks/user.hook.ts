import { PagingOption } from '../types/pagination.types';
import { ToRefs, reactive, watch, Ref } from 'vue-demi';
import { useQuery, useMutation } from 'vue-query';
import {
  deleteUserApi,
  findUserByIdApi,
  getUsersApi,
  updateUserApi,
} from '../api/user.api';
import { createEventHook } from '@vueuse/core';
import { UpdateUserDto } from '../types/user.types';

export const useUsers = ({ limit, page }: ToRefs<PagingOption>) => {
  return useQuery(reactive(['get-user', limit, page]), () =>
    getUsersApi(
      reactive({
        limit,
        page,
      })
    )
  );
};

export const useDeleteUser = () => {
  return useMutation('delete-User', (id: number) => deleteUserApi(id));
};

export const useDeleteUserHandler = () => {
  const deleted = createEventHook<void>();

  const { mutate: deleteMutate, isSuccess: isDeleteSuccess } = useDeleteUser();

  watch(isDeleteSuccess, (v) => {
    if (v) {
      deleted.trigger();
    }
  });

  const handleDeleteUser = (id: number) => {
    if (
      !confirm(
        `Are you sure you want to permanently remove this user and all its content?`
      )
    )
      return;
    deleteMutate(id);
  };
  return {
    handleDeleteUser,
    onDeleted: deleted.on,
  };
};

export const useUpdateUser = () => {
  return useMutation(
    'update-user',
    ({ id, body }: { id: number; body: UpdateUserDto }) =>
      updateUserApi(id, body)
  );
};

export const useFindUserById = (id: Ref<number>) => {
  return useQuery(reactive(['find-user-by-id', id]), () =>
    findUserByIdApi(id.value)
  );
};
