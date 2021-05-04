import Vue from 'vue'
import Nuex from '@/store/nuex.js'

Vue.use(Nuex);

export default new Nuex.Store({
  state: {
    msg: 'hello',
    num: 0
  },
  getters: {
    calcNum(state) {
      return state.num + 'px';
    }
  },
  mutations: {

  },
  actions: {

  },
  modules: {

  }
});
