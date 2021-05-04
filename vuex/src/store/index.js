import Vue from 'vue'
import Nuex from '@/store/nuex.js'

Vue.use(Nuex);
const home = {
  state: {
    name: 'homeName',
  }
};
const home2_1 = {
  state: {
    name: 'homeName2_1',
  }
};
const home2 = {
  state: {
    name: 'homeName2',
  },
  modules: { home2_1 }
};
const home3 = {
  state: {
    name: 'homeName3',
  },
};
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
    increase(state, payLoad) {
      state.num += payLoad;
    },
    decrease(state, payLoad) {
      state.num -= payLoad;
    }
  },
  actions: {
    asyncIncrease({ commit }, payLoad) {
      setTimeout(() => {
        commit('increase', payLoad);
      }, 1000);
    },
    asyncDecrease({ commit }, payLoad) {
      setTimeout(() => {
        commit('decrease', payLoad);
      }, 1000);
    }
  },
  modules: {
    home,
    home2,
    home3,
  }
});
