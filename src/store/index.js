import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    controlType: 0,
    connected: false,
    gamepadConnected: false,
    enableBasicState: false
  },
  getters: {
    controlType: (state) => state.controlType,
    connected: (state) => state.connected,
    gamepadConnected: (state) => state.gamepadConnected,
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
    setEnableBasicState(state, enableBasicState) {
      state.enableBasicState = enableBasicState;
    }
  },
  actions: {},
  modules: {},
});
