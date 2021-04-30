const compilerUtil = {
    // 解析xx.xx格式的value
    getValue(value, vm) {
        return value.split('.').reduce((data, currentKey) => {
            return data[currentKey];
        }, vm.$data)
    },
    getContent(content, vm) {
        const reg = /\{\{(.+?)\}\}/gi;
        // 确定是插值表达式
        return content.replace(reg, (...[, $1]) => this.getValue($1.trim(), vm));
    },
    model: function (node, value, vm) {
        node.value = this.getValue(value, vm);
    },
    html: function (node, value, vm) {
        node.innerHTML = this.getValue(value, vm);
    },
    text: function (node, value, vm) {
        node.innerText = this.getValue(value, vm);
    },
    content: function (node, content, vm) {
        node.textContent = this.getContent(content, vm);
    }
}

class Nue {
    constructor(options) {
        const el = options.el;
        if (this.isElement(el)) {
            this.$el = el;
        } else {
            this.$el = document.querySelector(el);
        }
        this.$data = options.data;
        if (this.$el) {
            new Observer(this.$data);
            new Compier(this);
        }
    }

    // 判断是否是一个元素
    isElement(node) {
        return node.nodeType === 1;
    }
}

class Compier {
    constructor(vm) {
        this.vm = vm;
        // 1.将网页上的元素放到内存中
        const fragment = this.node2fragment(this.vm.$el);
        // 2.利用指定的数据编译内存中的元素
        this.buildTemplate(fragment);
        // 3.将编译好的内容重新渲染到网页上
        this.vm.$el.appendChild(fragment);
    }

    node2fragment(app) {
        //1.创建一个空的文档碎片对象
        const fragment = document.createDocumentFragment();
        //2.编译循环获取每一个对象
        let node = app.firstChild;
        while (node) {
            //注意点: 只要将元素添加到了文档碎片对象中, 那么这个元素就会自动从网页上消失
            fragment.appendChild(node);
            node = app.firstChild;
        }
        return fragment;
    }

    buildTemplate(fragment) {
        const nodeList = [...fragment.childNodes];
        nodeList.forEach(node => {
            if (this.vm.isElement(node)) {
                // 是一个元素
                this.buildElement(node);
                // 递归: 处理子元素(处理后代)
                this.buildTemplate(node);
            } else {
                //   不是一个元素
                this.buildText(node);
            }
        })
    }

    buildElement(node) {
        const attrs = [...node.attributes];
        attrs.forEach(attr => {
            const {name, value} = attr;
            if (name.startsWith('v-')) {
                const [, directive] = name.split('-');
                compilerUtil[directive](node, value, this.vm);
            }
        })
    }

    buildText(node) {
        const content = node.textContent;
        const reg = /\{\{(.+?)\}\}/gi;
        if (reg.test(content)) {
            // 确定是插值表达式
            compilerUtil.content(node, content, this.vm)
        }
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
        Object.defineProperty(obj, attr, {
            set: (newVal) => {
                this.observer(newVal);
                if (value !== newVal) {
                    value = newVal;
                    console.log('set');
                }
            },
            get() {
                return value;
            },
        })
    }
}