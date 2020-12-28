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
const nodeOps = {
  tagName(node) {
    return node.tagName;
  },
  parentNode(node) {
    return node.parentNode;
  },
  createElement(tagName, vnode) {
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
function insert(parent, elm) {
  nodeOps.appendChild(parent, elm);
}
// TODO:
function createChildren(vnode, children, insertedVnodeQueue) {
  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      createElm(children[i], vnode.elm);
    }
  } else {
    nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(children));
  }
}
function createElm(vnode, parentElm) {
  // console.log('parentElm: ', parentElm);
  // console.log('vnode: ', vnode);
  // const data = vnode.data;
  // const children = v
  const { tag } = vnode;
  vnode.elm = nodeOps.createElement(tag, vnode);
  createChildren(vnode, vnode.children);
  insert(parentElm, vnode.elm);
}
const componentVNodeHooks = {
  init() {},
  destroy() {},
  insert() {},
  prepatch() {},
};
const hooksToMerge = Object.keys(componentVNodeHooks);
function mergeHook(one, two) {
  return function (a,b,c,d) {
    one(a,b,c,d);
    two(a,b,c,d);
  }
}
/**
  *@params data: VNodeData

*/
function mergeHooks (data) {
  const hooks = data.hooks;
  for (let i = 0; i < hooksToMerge.length; i++) {
    const key = hooksToMerge[i];
    const fromParent = hooks[key];
    const our = componentVNodeHooks[key];
    hooks[key] = fromParent ? mergeHook(ours, fromParent) : our;
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
  _init = function (options) {
    const { el } = options;
    if (el) {
      this.$mount(el);
    }
  }

  $mount(el) {
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

  _render() {
    const vm = this;
    const { render } = vm.$options;

    let vnode;
    // TODO: _renderProxy
    vnode = render(vm.$createElement);
    return vnode;
  }

  _update(vnode) {
    const vm = this;
    
    vm.__patch__(vm.$el, vnode);
  }

  __patch__(oldVnode, vnode) {
    function emptyNodeAt(elm) {
      return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm);
    }
    function createComponent(vnode, parentElm) {

    }
    oldVnode = emptyNodeAt(oldVnode);
    const oldElm = oldVnode.elm;
    const parentElm = nodeOps.parentNode(oldElm);
    createElm(
      vnode,
      parentElm,
    );
  }

  $createElement(tag, data, children) {
    function createComponent (Ctor, data, context, children) {
      // 1. 构造子类构造函数(这里需要实现extend)
      const baseCtor = Vue;
      // TODO: extend
      Ctor = baseCtor.extend(Ctor);

      // 2. 安装组件钩子函数
      mergeHooks(data);
      // 3. 实例化vnode
      const vnode = new VNode(
        `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
        data, undefined, undefined, undefined, context
      );
      return vnode;
    }

    let vnode;
    const vm = this;
    // TODO: normalizeChildren
    // children = normalizeChildren(children);
    if (typeof tag === 'string') {
      // 暂时只实现内置标签
      vnode = new VNode(tag, data, children, undefined, undefined, vm);
    } else {
      // TODO: createComponent
      vnode = createComponent(tag, data, vm, children);
    }
    return vnode;
  }
}

Vue.extend = function (extendOptions) {
  const Super = this;
  const Sub = function VueComponent (option) {
    // TODO: _init
    this._init(option);
  }
  Sub.prototype = Object.create(Super.prototype);

  Sub.extend = Super.extend
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

