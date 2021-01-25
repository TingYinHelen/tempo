import { initLifecycle } from './lifeCycle.js';
import { initRender } from './render.js';

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    this.$options = options;
    const vm = this;

    if (options && options._isComponent) {
      initInternalComponent(vm, options);
    } else {
      // TODO: mergeOptions
      // merge类静态的option和传入的option
      vm.$options = { ...vm.constructor.options, ...options };
    }

    initLifecycle(vm); // 初始化$children和$parent
    initRender(vm);  // $createElement

    const { el } = options;

    // 因为组件没有el，因此组件自己接管了$mount
    if (el) {
      this.$mount(el);
    }
  }
}

// 工具函数
function initInternalComponent(vm, options) {
  // 类的静态属性options赋值给vm.$options的原型
  // 原本的组件属性放在$options的实例属性上，这里传入的options放在$options的原型链上
  // const option = {
  //   _isComponent: true,
  //   _parentVnode: vnode,
  //   parent, // activeInstance当前激活的组件实例
  // };
  const opts = vm.$options = Object.create(vm.constructor.options);
  opts.parent = options.parent;
  opts._parentVnode = options._parentVnode;
}