// function _proxy(option) {
//   const {data, render} = option;
//   const that = this;
//   Object.keys(data).forEach(key => {
//     Object.defineProperty(that, key, {
//       get() {
//         return data[key];
//       },
//       set(newVal) {
//         data[key] = newVal;
//         render();
//       },
//     });
//   });
// }
// 保持当前的上下文vue实例，它是在lifecycle模块的全局变量
// 在实例化子组件的过程中，他需要知道当前上下文Vue实例是什么，并把它作为子组件的父Vue实例
let activeInstance = null

const nodeOps = {
  tagName(node) {
    return node.tagName;
  },
  parentNode(node) {
    return node.parentNode;
  },
  createElement(tagName, vnode) {
    // 这里的vnode传进来主要是给select用的，一般元素没有用到这个参数
    const elm = document.createElement(tagName);
    
    return elm;
  },
  appendChild(node, child) {
    node.appendChild(child);
  },
  createTextNode(text) {
    return document.createTextNode(text);
  },
};
function insert (parent, elm) {
  nodeOps.appendChild(parent, elm);
}

const componentVNodeHooks = {
  init (vnode) {
    if (vnode.componentInstance && !vnode.componentInstance._isDestroyed && vnode.data.keepAlive) {
      // TODO: keepAlive
    } else {
      // 子组件的实例化就在这个时机执行
      // createComponentInstanceForVnode是用来生成parent
      // TODO: activeInstance
      const child = vnode.componentInstance = createComponentInstanceForVnode(vnode, activeInstance);
      // 组件的el为undefined
      // 这个时候child的$options多了几个属性(parent, parentVnode)
      child.$mount(undefined);

      // 工具函数
      function createComponentInstanceForVnode (vnode, parent) {
        const option = {
          _isComponent: true,
          _parentVnode: vnode,
          parent, // activeInstance当前激活的组件实例
        };
        // inlineTemplate 部分的逻辑省略,这里会执行vue的构造函数_init

        // 这里Ctor就是子组件的构造函数，vnode的父组件的虚拟node
        // 这里既然new调用的是子组件的构造函数，后面的init函数的vm就是Ctor了(HelloVue组件对象)
        return new vnode.componentOptions.Ctor(option);
      }
    }
  },
  destroy() {},
  insert() {},
  prepatch() {},
};

// TODO:
function createChildren (vnode, children, insertedVnodeQueue) {
  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      createElm(children[i], vnode.elm);
    }
  } else {
    // 文本
    nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(children));
  }
}
function createElm (vnode, parentElm) {
  if (createComponent(vnode, parentElm)) {
    return;
  }

  const { tag, data = {} } = vnode;

  // 如果这里tag有值一定是真实的标签
  if (tag) {
    vnode.elm = nodeOps.createElement(tag, vnode);

    // TODO: 暂时这么写，后面需要改为updateAttrs
    const { style, attrs } = data;
    for (const key in attrs) {
      vnode.elm.setAttribute(key, attrs[key]);
    }
    for (const key in style) {
      vnode.elm.style[key] = style[key];
    }

    if (vnode.children) {
      createChildren(vnode, vnode.children);
    } else {
      insert(parentElm, vnode.elm);
    }
  }
  // 工具函数

  function createComponent (vnode, parentElm) {
    let i = vnode.data;
    if (i) {
      // 组件实例化(如果不是组件，没有mergeHooks的操作，就不走下面的逻辑)
      if ((i = i.hooks) && (i = i.init)) {
        // 让这个vnode生成一个vue实例
        i(vnode);
      }
      // vnode.componentInstance在上一步执行
      if (vnode.componentInstance) {
        // TODO: 这里vnode.elm为空(暂时不知道为什么为空，用vnode.componentInstance.$el代替)
        insert(parentElm, vnode.componentInstance.$el);
        return true;
      }
    }
  }
}

const hooksToMerge = Object.keys(componentVNodeHooks);
function mergeHook(one, two) {
  return function (a,b,c,d) {
    one(a,b,c,d);
    two(a,b,c,d);
  }
}

function mergeHooks(data) {
  const hooks = data.hooks || (data.hooks = {});
  for (let i = 0; i < hooksToMerge.length; i++) {
    const key = hooksToMerge[i];
    const fromParent = hooks[key];
    const our = componentVNodeHooks[key];
    hooks[key] = fromParent ? mergeHook(fromParent, ours) : our;
  }
} 

class Vue {
  constructor(options) {
    this.$options = options;
    this._init(options);
    // _proxy.call(this, option);
    // this._data = option.data;
    // observer(this._data, option.render);
  }
  _init (options) {
    const vm = this;
    if (options && options._isComponent) {
      initInternalComponent(vm, options);
    } else {
      // TODO: mergeOptions
      vm.$options = { ...vm.constructor.options, ...options };
    }

    initLifecycle(vm)

    const { el } = options;
    // 因为组件没有el，因此组件自己接管了$mount
    if (el) {
      this.$mount(el);
    }
    // 工具函数
    function initInternalComponent(vm, options) {
      // 这里把vm的Ctor上的option赋值给vm.$options的原型
      // 其实就是组件options(HelloVue的option)
      // vm.constructor.options是原型上的options
      const opts = vm.$options = Object.create(vm.constructor.options);
      // 通过 initInternalComponent 函数传入的几个参数合并到$options里
      opts.parent = options.parent;
      opts._parentVnode = options._parentVnode;
    }
    function initLifecycle(vm) {
      const option = vm.$options;
      let parent = option.parent;

      // TODO: options.abstract
      if (parent) {
        // 通过parent.$children.push(vm)，来把当前的vm存储到父实例中
        parent.$children.push(vm);
      }
      // 当前实例的子实例
      vm.$children = [];
      // $parent用来保存当前实例的父实例
      vm.$parent = parent;
    }
  }
  // 挂载到哪个dom上完全依赖$mount的el参数
  // 每次调用$mount其实是去生成该实例的子组件
  $mount (el) {
    el = document.querySelector(el);
    
    const options = this.$options;
    if (!options.render) {
      let template = options.template;
      // TODO: compileToFunctions
      if (template) {
        const { render } = compileToFunctions(template);
        options.render = render;
      }
    }

    function mountComponent(vm, el) {
      vm.$el = el;
      const updateComponent = () => {
        vm._update(vm._render());
      };
      // TODO: Watcher
      // new Watcher(vm, updateComponent);
      updateComponent();
    }

    return mountComponent(this, el);
  }

  _render () {
    const vm = this;
    const { render, _parentVnode } = vm.$options;

    vm.$vnode = _parentVnode;

    let vnode;
    // TODO: _renderProxy
    vnode = render(vm.$createElement);

    vnode.parent = _parentVnode;
    return vnode;
  }

  _update (vnode) {
    const vm = this;

    const prevEl = vm.$el;
    const prevVnode = vm._vnode;

    // 实际上prevActiveInstance和当前的vm是一个父子关系。
    const prevActiveInstance = activeInstance;
    activeInstance = vm;

    // _vnode(子),$vnode(父)
    // 这里的vnode是通过该组件的render函数生成的
    vm._vnode = vnode;
    
    if (!prevVnode) {
      // 初始化的render
      vm.$el = vm.__patch__(vm.$el, vnode);
    } else {
      // updates
    }
    
    
    activeInstance = prevActiveInstance;
  }

  __patch__ (oldVnode, vnode) {
    // oldVnode没有的时候是组件
    // 组件是没有el
    if (!oldVnode) {
      createElm(vnode);
    } else {
      oldVnode = emptyNodeAt(oldVnode);
      const oldElm = oldVnode.elm;
      const parentElm = nodeOps.parentNode(oldElm);
      createElm(
        vnode,
        parentElm,
      );
    }
    // 工具函数
    function emptyNodeAt(elm) {
      return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm);
    }
    return vnode.elm;
  }

  $createElement (tag, data, children) {
    let vnode;
    const vm = this;
    // TODO: normalizeChildren
    // children = normalizeChildren(children);
    if (typeof tag === 'string') {
      // 暂时只实现内置标签
      vnode = new VNode(tag, data, children, undefined, undefined, vm);
    } else {
      // 生成组建vnode
      // 这里的tag是子组件的组件对象(第一次就是HelloVue)
      vnode = createComponent(tag, data, vm, children);
    }
    
    // 工具函数
    function createComponent (Ctor, data, context, children) {
      // 1. 构造子类(子组件)构造函数
      const baseCtor = Vue;
      // 子组件传入的options已经放在Ctor的静态属性上了, 如果后面new 这个Ctor的时候有传入了option，则要跟
      // 现在传入的Ctor做合并
      Ctor = baseCtor.extend(Ctor);

      data = data || {};

      // 2. 安装组件钩子函数
      mergeHooks(data);
      // 3. 实例化vnode
      // TODO: propsData, listeners, tag
      const { name } = Ctor.options;
      const vnode = new VNode(
        `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
        data, undefined, undefined, undefined, context,
        { Ctor, children },
      );
      return vnode;
    }

    // return
    return vnode;
  }
}

Vue.extend = function (extendOptions) {
  extendOptions = extendOptions || {};
  // const { name } = extendOptions;

  const Super = this;
  const Sub = function VueComponent (options) {
    this._init(options);
  }
  // 继承vue原型
  Sub.prototype = Object.create(Super.prototype);
  Sub.prototype.constructor = Sub;

  Sub.options = { ...Super.options, ...extendOptions };

  Sub.extend = Super.extend;

  // if (name) {
  //   Sub.options.components.name = name;
  // }

  return Sub;
}


class VNode {
  constructor(
    tag,
    data,
    children,
    text,
    elm,
    context,
    componentOptions,
  ) {
    this.tag = tag;
    this.data = data;
    this.children = children;
    this.text = text;
    this.elm = elm;
    this.context = context;
    this.componentOptions = componentOptions;
  }
}

function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  )
}

//TODO: VNode
function createTextVNode(val) {
  return new VNode(undefined, undefined, undefined, String(val));
}

function normalizeChildren(children) {
  const res = [];
  for (let i = 0; i < children.length; i++) {
    const c = children[i];
    if (isPrimitive(c)) {
      res.push(createTextVNode(c));
    }
  }
  return res;
}

// function observer(data, cb) {
//   Object.keys(data).forEach((key) => defineReactive(data, key, data[key], cb));
// }

// function defineReactive(data, key, value, cb) {
//   const dep = new Dep();
//   Object.defineProperty(data, key, {
//     get() {
//       // 收集依赖
//       dep.addSub();
//       return value;
//     },
//     set(newVal) {
//       value = newVal;
//       dep.notify();
//       // cb(); // set的时候执行render
//     },
//   });
// }

// class Dep {
//   constructor() {
//     this.subs = [];
//   }
//   addSub(sub) {
//     this.subs.push(sub);
//   }
//   removeSub() {}
//   notify() {
//     this.subs.forEach((sub) => {
//       sub.update();
//     });
//   }
// }

