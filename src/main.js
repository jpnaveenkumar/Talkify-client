import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router';
import router from './router/router';
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-default.css';
Vue.use(VueToast,{
  position: 'top',
  duration: 3000
});

Vue.config.productionTip = false
Vue.use(VueRouter);
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
