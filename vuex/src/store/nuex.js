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
    this.state = options.state;
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