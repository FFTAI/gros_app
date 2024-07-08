import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    controlType: 0,
    connected: false,
    gamepadConnected: false,
    currRobot: ""
  },
  getters: {
    controlType: (state) => state.controlType,
    connected: (state) => state.connected,
    gamepadConnected: (state) => state.gamepadConnected,
    currRobot: (state) => state.currRobot,
  },
  mutations: {
    setControlType(state, type) {
      state.controlType = type;
    },
    setConnected(state, connected) {
      state.connected = connected;
    },
    setGamepadConnected(state, gamepadConnected) {
      state.gamepadConnected = gamepadConnected;
    },
    setCurrRobot(state, currRobot) {
      state.currRobot = currRobot;
    },
  },
  actions: {},
  modules: {},
});
