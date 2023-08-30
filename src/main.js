import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import axios from "axios";
import i18n from "./i18n/i18n";
import { Robot } from "/Users/jax/Documents/GitHub/gros_client_js/index";

Vue.prototype.$axios = axios;
Vue.prototype.$store = store;
Vue.prototype.$webview = null;
Vue.prototype.$robot = new Robot({host: '127.0.0.1'});

Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
  router, store, i18n, render: (h) => h(App)
}).$mount("#app");
 