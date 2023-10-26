import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/startUp",
    name: "startUp",
    component: () =>
      import("../views/startUp/StartUp.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import("../views/login/Login.vue"),
  },
  {
    path: "/connect",
    name: "connect",
    component: () =>
      import("../views/connect/Connect.vue"),
  },
  {
    path: "/loading",
    name: "loading",
    component: () =>
      import("../views/loading/Loading.vue"),
  },
  {
    path: "/controller",
    name: "controller",
    component: () =>
      import("../views/controller/Controller.vue"),
  },
  {
    path: "/development",
    name: "development",
    component: () =>
      import("../views/development/Development.vue"),
  },
  {
    path: "/setting",
    name: "setting",
    component: () =>
      import("../views/setting/Setting.vue"),
  },
  {
    path: "/initialization",
    name: "initialization",
    component: () =>
      import("../views/initialization/Initialization.vue"),
  },
  {
    path: "/",
    redirect: "/startUp"
  }
];

const router = new VueRouter({
  routes,
});

export default router;
