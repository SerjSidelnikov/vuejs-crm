import Vue from 'vue';
import Vuelidate from 'vuelidate';
import Paginate from 'vuejs-paginate';
import VueMeta from 'vue-meta';
import App from './App.vue';
import Loader from './components/app/Loader';
import './registerServiceWorker';
import router from './router';
import store from './store';
import tooltipDirective from './directives/tooltip.directive';
import dateFilter from './filters/date.filters';
import currencyFilter from './filters/currency.filter';
import localizeFilter from './filters/localize.filter';
import messagePlugin from './utils/message.plugin';
import 'materialize-css/dist/js/materialize.min';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

Vue.config.productionTip = false;

Vue.use(messagePlugin);
Vue.use(Vuelidate);
Vue.use(VueMeta);
Vue.filter('date', dateFilter);
Vue.filter('currency', currencyFilter);
Vue.filter('localize', localizeFilter);
Vue.directive('tooltip', tooltipDirective);
Vue.component('Loader', Loader);
Vue.component('Paginate', Paginate);

firebase.initializeApp({
  apiKey: 'AIzaSyBlqdpauAgf3hZbdKfyt604KtzkUoszNA8',
  authDomain: 'vue-crm-e8919.firebaseapp.com',
  databaseURL: 'https://vue-crm-e8919.firebaseio.com',
  projectId: 'vue-crm-e8919',
  storageBucket: 'vue-crm-e8919.appspot.com',
  messagingSenderId: '636445070911',
  appId: '1:636445070911:web:cf7f74c02f9d00dd03ca8a'
});

let app;

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app');
  }
});
