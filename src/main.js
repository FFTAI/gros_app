import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import i18n from "./i18n/i18n";
import axios from "axios";
import Bus from '@/utils/bus.js'
import robotWs from '@/utils/robotWs.js'

Vue.prototype.$http = axios;
Vue.prototype.$store = store;
Vue.prototype.$webview = null;
Vue.prototype.$bus = Bus
Vue.prototype.robotWs = robotWs


Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
