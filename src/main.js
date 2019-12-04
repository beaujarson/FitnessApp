import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import { AppRouter } from "./route-init.js";
import Vuex from 'vuex'
import store from './store.js'

Vue.use(Vuex)
Vue.config.productionTip = false

new Vue({
    store,
    vuetify, render: (h) => h(App), router: AppRouter
}).$mount("#app");

// new Vue({
//   vuetify,

//   render: function(gimme_a_component) {
//     return gimme_a_component(App);
//   }
// });
