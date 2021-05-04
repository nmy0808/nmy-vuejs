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

  }
}
export default {
  install,
  Store
}