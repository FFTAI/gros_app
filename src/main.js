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
// const {app, BrowserWindow} = require('electron')

Vue.prototype.$http = axios;
Vue.prototype.$store = store;
Vue.prototype.$webview = null;
Vue.prototype.$bus = Bus
Vue.prototype.robotWs = robotWs
Vue.use(ElementUI);
Vue.config.productionTip = false;

// const setup_server = (port) => {
//   server_app.use('/', express.static(dist));
//   const server = createServer(server_app);
//   server.listen(port, async () => {
//       const ws = new WebSocketServer({server});
//       socketHandler(ws);
//   });

// }

// app.commandLine.appendSwitch('js-flags', '--max-old-space-size=8000');

// app.whenReady().then(() => {
//   const win = new BrowserWindow({
//       width: 800,
//       height: 600,
//       webPreferences: {nodeIntegration: true}
//   })

//   let randomNumber = Math.floor(Math.random() * 65536);
//   setup_server(randomNumber)
//   win.loadURL(`http://localhost:${randomNumber}`)
// })

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
