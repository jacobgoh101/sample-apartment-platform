<template>
  <b-navbar shadow spaced>
    <template #brand>
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <img
          src="@/assets/logo.png"
          alt="Lightweight UI components for Vue.js based on Bulma"
        />
      </b-navbar-item>
    </template>
    <template #start>
      <b-navbar-dropdown label="Manage" v-if="hasRealtorRole || hasAdminRole">
        <b-navbar-item
          tag="router-link"
          :to="{ name: 'ManageUsers' }"
          v-if="hasAdminRole"
        >
          Manage Users
        </b-navbar-item>
      </b-navbar-dropdown>
    </template>

    <template #end>
      <b-navbar-item tag="div">
        <div class="buttons" v-if="isLoggedIn">
          <router-link class="button is-light" :to="{ name: 'Logout' }">
            Log out
          </router-link>
        </div>
        <div class="buttons" v-else>
          <router-link class="button is-primary" :to="{ name: 'Signup' }">
            <strong>Sign up</strong>
          </router-link>
          <router-link class="button is-light" :to="{ name: 'Login' }">
            Log in
          </router-link>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script lang="ts">
import { useAuth } from '../hooks/authentication.hook';
import { useRoles } from '../hooks/rbac.hook';
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  setup() {
    const { isLoggedIn, user } = useAuth();
    const { hasRealtorRole, hasAdminRole } = useRoles();
    return { isLoggedIn, user, hasRealtorRole, hasAdminRole };
  },
});
</script>
