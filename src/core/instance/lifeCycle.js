// 保持当前的上下文vue实例，它是在lifecycle模块的全局变量
// 在实例化子组件的过程中，他需要知道当前上下文Vue实例是什么，并把它作为子组件的父Vue实例
export let activeInstance = null;

export function initLifecycle(vm) {
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

// TODO: mountComponent会调用 beforeMount 和 mounted
export function mountComponent(vm, el) {
  vm.$el = el;

  // TODO: callHook
  // callHook(vm, 'beforeMount');

  const updateComponent = () => {
    vm._update(vm._render());
  };
  // TODO: Watcher
  // new Watcher(vm, updateComponent);
  updateComponent();

  // TODO: callHook
  // callHook(vm, 'mounted');
}

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this;

    // const prevEl = vm.$el;
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

  // TODO: 
  Vue.prototype.$forceUpdate = function() {}

  // TODO:
  Vue.prototype.$destroy = function() {}
}