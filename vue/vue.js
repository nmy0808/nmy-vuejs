const compilerUtil = {
  getValue(vm, value) {
    const data = vm.$data;
    return value.split('.').reduce((data, cur) => {
      return data[cur];
    }, data)
  },
  getContent(textContent, vm) {
    return textContent.replace(/\{\{(.+?)\}\}/g, (...[, $1]) => {
      return this.getValue(vm, $1.trim())
    })
  },
  model(vm, node, value) {
    Dep.target = new Watcher(vm, value, (newValue) => {
      node.value = newValue;
    })
    const res = compilerUtil.getValue(vm, value);
    node.value = res;
    node.addEventListener('input', function () {
      vm[value] = this.value;
    })
  },
  html(vm, node, value) {
    Dep.target = new Watcher(vm, value, (newValue) => {
      node.innerHTML = newValue;
    })
    const res = compilerUtil.getValue(vm, value);
    node.innerHTML = res;
    Dep.target = null;
  },
  text(vm, node, value) {
    Dep.target = new Watcher(vm, value, (newValue) => {
      node.innerText = newValue;
    })
    const res = compilerUtil.getValue(vm, value);
    node.innerText = res;
    Dep.target = null;
  },
  textContent(vm, node, textContent) {
    const compileTextContent = textContent.replace(/\{\{(.+?)\}\}/g, (...[, value]) => {
      Dep.target = new Watcher(vm, value.trim(), (newValue) => {
        node.textContent = this.getContent(textContent, vm);
      })
      return compilerUtil.getValue(vm, value.trim());
    })
    node.textContent = compileTextContent;
  },
  on(vm, node, value, directiveType) {
    node.addEventListener(directiveType, (e) => {
      vm.$methods[value].call(vm, e);
    })
  }
}
class Vue {
  constructor(options) {
    this.$data = options.data || {};
    this.$computed = options.computed;
    this.$methods = options.methods;
    this.proxyData();
    this.computed2data();
    if (options.el) {
      if (typeof options.el === 'string') {
        this.$el = document.querySelector(options.el);
      } else if (options.el.node.nodeType === 1) {
        this.$el = options.el;
      }
    }
    if (this.$el) {
      new Observer(this.$data);
      new Compile(this);
    }
  }
  proxyData() {
    for (const prop in this.$data) {
      Object.defineProperty(this, prop, {
        get() {
          return this.$data[prop];
        },
        set(newVal) {
          this.$data[prop] = newVal;
        }
      })
    }
  }
  computed2data() {
    for (const key in this.$computed) {
      Object.defineProperty(this.$data, key, {
        get: () => {
          return this.$computed[key].call(this);
        }
      })
    }
  }
}
class Compile {
  constructor(vm) {
    this.vm = vm;
    const frag = this.createFragment();
    this.buildTemplate(frag);
    this.vm.$el.appendChild(frag);
  }
  createFragment() {
    const frag = document.createDocumentFragment();
    const childNodes = [...this.vm.$el.childNodes];
    childNodes.forEach(node => {
      frag.appendChild(node);
    });
    return frag;
  }
  buildTemplate(frag) {
    const childNodes = [...frag.childNodes];
    childNodes.forEach(node => {
      if (node.nodeType === 1) {
        this.buildElementTemplate(node);
        this.buildTemplate(node);
      } else {
        this.buildTextTemplate(node);
      }
    });
  }
  buildElementTemplate(node) {
    const nodeList = [...node.attributes];
    nodeList.forEach(attr => {
      const { name, value } = attr;
      if (this.isDirective(name)) {
        const directive = name.substr(2);
        const [directiveName, directiveType] = directive.split(':');
        const func = compilerUtil[directiveName];
        if (func) {
          func(this.vm, node, value, directiveType);
        }
      }
    });
  }
  buildTextTemplate(node) {
    const textContent = node.textContent;
    if (this.isExpress(textContent)) {
      compilerUtil.textContent(this.vm, node, textContent);
    }
  }
  isDirective(attrName) {
    return /^v-/g.test(attrName);
  }
  isExpress(textContent) {
    if (/\{\{.+\}\}/g.test(textContent)) {
      return true;
    }
    return false;
  }
}
class Observer {
  // 只要将需要监听的那个对象传递给Observer这个类
  // 这个类就可以快速的给传入的对象的所有的属性都添加get/set方法
  constructor(data) {
    this.observer(data);
  }
  observer(obj) {
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        this.defineReactive(obj, key, obj[key]);
      }
    }
  }
  defineReactive(obj, attr, value) {
    // 如果属性的取值是一个对象, 则需要递归
    this.observer(value);
    const dep = new Dep();
    Object.defineProperty(obj, attr, {
      set: (newVal) => {
        if (value !== newVal) {
          value = newVal;
          dep.notify();
        }
      },
      get() {
        Dep.target && dep.addSub(Dep.target);
        return value;
      },
    })
  }
}
class Dep {
  constructor() {
    this.subs = [];
  }
  addSub(watcher) {
    this.subs.push(watcher);
  }
  notify() {
    this.subs.forEach(watcher => {
      watcher.update();
    });
  }
}
class Watcher {
  constructor(vm, attrValue, cb) {
    this.vm = vm;
    this.attrValue = attrValue;
    this.cb = cb;
    this.oldValue = this.getOldValue();
  }
  getOldValue() {
    return compilerUtil.getValue(this.vm, this.attrValue);
  }
  update() {
    const newValue = compilerUtil.getValue(this.vm, this.attrValue);
    if (this.oldValue !== newValue) {
      this.cb(newValue, this.oldValue);
    }
  }
}