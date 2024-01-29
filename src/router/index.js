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
    path: "/login",
    name: "login",
    component: () => import("../views/login/Login.vue"),
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
    path: "/development",
    name: "development",
    component: () => import("../views/development/Development.vue"),
  },
  {
    path: "/setting",
    name: "setting",
    component: () => import("../views/setting/Setting.vue"),
  },
  {
    path: "/robotStartup",
    name: "robotStartup",
    component: () => import("../views/robotStartup/RobotStartup.vue"),
  },
  {
    path: "/selectRobot",
    name: "selectRobot",
    component: () => import("../views/selectRobot/SelectRobot.vue"),
  },
  {
    path: "/connectionMode",
    name: "connectionMode",
    component: () => import("../views/connectionMode/ConnectionMode.vue"),
  },
  {
    path: "/qrCode",
    name: "qrCode",
    component: () => import("../views/qrCode/QrCode.vue"),
  },
  {
    path: "/pointCloud",
    name: "pointCloud",
    component: () => import("../views/pointCloud/PointCloud.vue"),
  },
  {
    path: "/singleMotor",
    name: "pointClosingleMotorud",
    component: () => import("../views/singleMotor/SingleMotor.vue"),
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
