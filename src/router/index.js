import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/home",
    name: "home",
    component: () =>
      import("../views/Home.vue"),
  },
  {
    path: "/rooms",
    name: "rooms",
    component: () =>
      import("../views/Rooms.vue"),
  },
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
    path: "/",
    redirect: "/controller"
  }
];

const router = new VueRouter({
  routes,
});

export default router;
