import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import i18n from "./i18n/i18n";
import { Human } from "rocs-client";
import axios from 'axios'

Vue.prototype.$http= axios
Vue.prototype.$store = store;
Vue.prototype.$webview = null;
Vue.prototype.$robot = new Human({host: '192.168.10.188'});
// Vue.prototype.$robot = new Human({host: '192.168.11.173'});

Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
  router, store, i18n, render: (h) => h(App)
}).$mount("#app");
 