import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Logout from '../views/Logout.vue';
import ManageUsers from '../views/ManageUsers.vue';
import EditUser from '../views/EditUser.vue';
import CreateUser from '../views/CreateUser.vue';
import ManageApartments from '../views/ManageApartments.vue';
import EditApartment from '../views/EditApartment.vue';
import CreateApartment from '../views/CreateApartment.vue';
import Signup from '../views/Signup.vue';
import VerifyEmail from '../views/VerifyEmail.vue';
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
    path: '/admin/users/new',
    name: 'CreateUser',
    component: CreateUser,
  },
  {
    path: '/admin/users/:id',
    name: 'EditUser',
    component: EditUser,
  },
  {
    path: '/apartments/managements',
    name: 'ManageApartments',
    component: ManageApartments,
  },
  {
    path: '/apartments/new',
    name: 'CreateApartment',
    component: CreateApartment,
  },
  {
    path: '/apartments/:id/edit',
    name: 'EditApartment',
    component: EditApartment,
  },
  {
    path: '/email/verify',
    name: 'VerifyEmail',
    component: VerifyEmail,
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
