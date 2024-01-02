import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    controlType: 0,
    connected: false,
    gamepadConnected: false,
    robotInit: true,
    enableBasicState: false
  },
  getters: {
    controlType: (state) => state.controlType,
    connected: (state) => state.connected,
    gamepadConnected: (state) => state.gamepadConnected,
    robotInit: (state) => state.robotInit,
    enableBasicState: (state) => state.enableBasicState,
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
    setRobotInit(state, robotInit) {
      state.robotInit = robotInit;
    },
    setEnableBasicState(state, enableBasicState) {
      state.enableBasicState = enableBasicState;
    }
  },
  actions: {},
  modules: {},
});
