import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    controlType: 0,
    iP: {
      host: '127.0.0.1',
      port: '4197'
    }
  },
  getters: {
    controlType: state => state.controlType
  },
  mutations: {
    setControlType(state,type){
      state.controlType = type
    },
    setIP(state,iP){
      state.iP = iP
    }
  },
  actions: {},
  modules: {},
});
