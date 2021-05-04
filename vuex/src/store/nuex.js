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

class ModuleCollection {
  constructor(rootModule) {
    this.register([], rootModule)
  }
  register(arr, rootModule) {
    // 1.按照需要的格式创建模块
    const module = {
      _raw: rootModule,
      _state: rootModule.state,
      _children: {}
    }
    // 2.保存模块信息
    if (arr.length === 0) {
      // 保存子模块
      this.root = module;
    } else {
      // 获取父模块
      // 注意点: 如果数组里只有一个['xx'], arr.splice(0, arr.length - 1) 的结果等于[], 所以reduce返回的是this.root
      const parentModule = arr.splice(0, arr.length - 1).reduce((root, currentKey) => {
        return root._children[currentKey];
      }, this.root)
      // 存入父模块
      parentModule._children[arr[arr.length - 1]] = module;
    }
    // 3.处理子模块
    for (const childrenModuleName in rootModule.modules) {
      const childModule = rootModule.modules[childrenModuleName];
      // 只有有子模块的才会拼接这个数组
      this.register(arr.concat(childrenModuleName), childModule)
    }
  }
}
class Store {
  constructor(options) {
    // this.state = options.state;
    // 将某个数据双向绑定数据(指定对象, 指定属性, 指定值)
    Vue.util.defineReactive(this, 'state', options.state);
    // 提取模块化信息
    this.modules = new ModuleCollection(options);
    // 安装子模块数据
    this.initModules([], this.modules.root);
  }
  dispatch(type, payload) {
    this.actions[type].forEach(func => func(payload));
  }
  commit = (type, payload) => {
    this.mutations[type].forEach(func => func(payload));
  }
  initModules(arr, rootModule) {
    if (arr.length > 0) {
      const parent = arr.splice(0, arr.length - 1).reduce((state, currentKey) => {
        return state[currentKey];
      }, this.state);
      Vue.set(parent, arr[arr.length - 1], rootModule._state);
    }
    this.initGetters(rootModule._raw);
    this.initMutations(rootModule._raw);
    this.initActions(rootModule._raw);
    for (const childModuleKey in rootModule._children) {
      const childModule = rootModule._children[childModuleKey];
      this.initModules(arr.concat(childModuleKey), childModule);
    }
  }
  initActions(options) {
    const actions = options.actions || {};
    this.actions = this.actions || {};
    for (const key in actions) {
      this.actions[key] = this.actions[key] || [];
      this.actions[key].push((payload) => {
        actions[key](this, payload);
      })
    }
  }
  initMutations(options) {
    const mutations = options.mutations || {};
    this.mutations = this.mutations || {};
    for (const key in mutations) {
      this.mutations[key] = this.mutations[key] || [];
      this.mutations[key].push((payload) => {
        mutations[key](options.state, payload);
      })
    }
  }
  initGetters(options) {
    const getters = options.getters || {};
    this.getters = this.getters || {};
    for (const key in getters) {
      Object.defineProperty(this.getters, key, {
        get: () => {
          return getters[key](options.state);
        }
      })
    }
  }
}
export default {
  install,
  Store
}