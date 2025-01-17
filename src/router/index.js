import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/startUp",
    name: "startUp",
    component: () => import("../views/startUp/StartUp.vue"),
  },
  {
    path: "/loading",
    name: "loading",
    component: () => import("../views/loading/Loading.vue"),
  },
  {
    path: "/controller",
    name: "controller",
    component: () => import("../views/controller/Controller.vue"),
  },
  {
    path: "/connectionManagement",
    name: "connectionManagement",
    component: () => import("../views/connectionManagement/ConnectionManagement.vue"),
  },
  {
    path: "/demonstrate",
    name: "demonstrate",
    component: () => import("../views/demonstrate/Demonstrate.vue"),
  },
  {
    path: "/",
    redirect: "/startUp",
  },
];

const router = new VueRouter({
  routes,
});

export default router;
