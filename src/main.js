import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router';
import router from './router/router';
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-default.css';
import store from './service/store';
Vue.use(VueToast,{
  position: 'top',
  duration: 2000
});

Vue.config.productionTip = false
window.talkify = {};
window.talkify.store = store;
Vue.use(VueRouter);
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
