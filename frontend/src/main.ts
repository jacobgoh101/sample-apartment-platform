import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bulma-social/bin/bulma-social.min.css';
import { QueryClient, VUE_QUERY_CLIENT } from 'vue-query';
import { ValidationObserver } from 'vee-validate';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ValidationProvider } from 'vee-validate/dist/vee-validate.full.esm';

Vue.config.productionTip = false;
Vue.prototype.log = console.log;
Vue.use(Buefy);

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);

const queryClient = new QueryClient();
queryClient.mount();

new Vue({
  router,
  store,
  provide: {
    [VUE_QUERY_CLIENT]: queryClient,
  },
  render: (h) => h(App),
}).$mount('#app');
