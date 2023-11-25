import Vue from "vue";
import Vuex from "vuex";
import { Human } from "rocs-client";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    robot: new Human({host: process.env.VUE_APP_URL.split('//')[1].split(':')[0]}),
    controlType: 0,
    connected: false,
    gamepadConnected: false
  },
  getters: {
    robot: state => state.robot,
    controlType: state => state.controlType,
    connected: state => state.connected,
    gamepadConnected: state => state.gamepadConnected
  },
  mutations: {
    setControlType(state,type){
      state.controlType = type
    },
    setConnected(state,connected){
      state.connected = connected
    },
    setRobot(state){
      state.robot = new Human({host: process.env.VUE_APP_URL.split('//')[1].split(':')[0]})
    },
    setGamepadConnected(state,gamepadConnected){
      state.gamepadConnected = gamepadConnected
    }
  },
  actions: {},
  modules: {},
});
