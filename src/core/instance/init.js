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
  // 这里把vm的Ctor上的option赋值给vm.$options的原型
  // 其实就是组件options(HelloVue的option)
  // vm.constructor.options是原型上的options
  const opts = vm.$options = Object.create(vm.constructor.options);
  // 通过 initInternalComponent 函数传入的几个参数合并到$options里
  opts.parent = options.parent;
  opts._parentVnode = options._parentVnode;
}