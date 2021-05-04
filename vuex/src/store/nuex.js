import Vue from "vue";

function install(Vue) {
  Vue.mixin({
    // 判断root是否配置了store
    beforeCreate() {
      if (this.$options && this.$options.store) {
        this.$store = this.$options.store;
      } else {
        this.$store = this.$parent.$store;
      }
    }
  })
}
class Store {
  constructor(options) {
    // this.state = options.state;
    // 将某个数据双向绑定数据(指定对象, 指定属性, 指定值)
    Vue.util.defineReactive(this, 'state', options.state);
    this.initGetters(options);
    this.initMutations(options);
    this.commit = (type, payload) => {
      this.mutations[type](payload);
    }
  }
  initMutations(options) {
    const mutations = options.mutations || {};
    this.mutations = {};
    for (const key in mutations) {
      this.mutations[key] = (payload) => {
        mutations[key](this.state, payload);
      }
    }

  }
  initGetters(options) {
    const getters = options.getters || {};
    this.getters = {};
    for (const key in getters) {
      Object.defineProperty(this.getters, key, {
        get: () => {
          return getters[key](this.state);
        }
      })
    }
  }
}
export default {
  install,
  Store
}