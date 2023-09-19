import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import i18n from "./i18n/i18n";
import { Human } from "gros-client";

Vue.prototype.$store = store;
Vue.prototype.$webview = null;
// Vue.prototype.$robot = new Human({host: '192.168.8.122'});
Vue.prototype.$robot = new Human({host: '192.168.9.17'});
// Vue.prototype.$robot = new Human({host: '192.168.31.25'});

Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
  router, store, i18n, render: (h) => h(App)
}).$mount("#app");
 