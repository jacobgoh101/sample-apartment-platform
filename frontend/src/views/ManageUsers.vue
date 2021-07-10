<template>
  <div class="mt-5">
    <div class="pt-5" />
    <b-table :data="items">
      <template #empty>
        <div class="has-text-centered m-5 p-5">No records</div>
      </template>

      <b-table-column field="id" label="ID" width="40" numeric v-slot="{ row }">
        {{ row.id }}
      </b-table-column>

      <b-table-column field="name" label="Name" v-slot="{ row }">
        {{ row.name }}
      </b-table-column>

      <b-table-column field="email" label="Email" v-slot="{ row }">
        {{ row.email }}
      </b-table-column>

      <b-table-column
        field="emailVerified"
        label="Email Verified"
        v-slot="{ row }"
      >
        <b-checkbox :value="row.emailVerified" />
      </b-table-column>

      <b-table-column field="blocked" label="Blocked" v-slot="{ row }">
        <b-checkbox :value="row.blocked" />
      </b-table-column>

      <b-table-column field="type" label="Signup Type" v-slot="{ row }">
        <span v-if="row.googleAccountId">Google</span>
        <span v-else-if="row.facebookAccountId">Facebook</span>
        <span v-else>Email &amp; Password</span>
      </b-table-column>

      <b-table-column label="Action" v-slot="{ row: { id } }">
        <div class="buttons">
          <b-button
            type="is-primary"
            size="is-small"
            icon-left="pencil"
            tag="router-link"
            :to="{
              name: 'EditUser',
              params: {
                id,
              },
            }"
          >
            Edit
          </b-button>
          <b-button
            type="is-danger"
            size="is-small"
            icon-left="delete"
            @click="handleDeleteUser(id)"
          >
            Delete
          </b-button>
        </div>
      </b-table-column>
    </b-table>
    <hr />
    <b-pagination
      :total="total"
      v-model="page"
      :per-page="limit"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      aria-page-label="Page"
      aria-current-label="Current page"
    >
    </b-pagination>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api';
import { useAdminGuard } from '@/hooks/route.hook.ts';
import { useDeleteUserHandler, useUsers } from '@/hooks/user.hook';

export default defineComponent({
  setup() {
    useAdminGuard();

    const page = ref(1);
    const limit = ref(10);

    const { data, refetch } = useUsers({
      page,
      limit,
    });

    const { handleDeleteUser, onDeleted } = useDeleteUserHandler();
    onDeleted(() => refetch.value());

    return {
      items: computed(() => data.value?.data?.items),
      total: computed(() => data.value?.data?.meta?.totalItems),
      limit,
      page,
      handleDeleteUser,
    };
  },
});
</script>
