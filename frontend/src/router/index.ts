import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Logout from '../views/Logout.vue';
import ManageUsers from '../views/ManageUsers.vue';
import EditUser from '../views/EditUser.vue';
import Signup from '../views/Signup.vue';
import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout,
  },
  {
    path: '/admin/users/managements',
    name: 'ManageUsers',
    component: ManageUsers,
  },
  {
    path: '/admin/users/:id',
    name: 'EditUser',
    component: EditUser,
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;

export function useRouter() {
  return router;
}
