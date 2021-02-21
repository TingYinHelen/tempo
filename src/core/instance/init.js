import { initLifecycle, callHook } from './lifeCycle.js';
import { initRender } from './render.js';
import { initState } from './state.js'
import { mergeOptions } from '../utils/options.js';

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    this.$options = options;
    const vm = this;

    if (options && options._isComponent) {
      initInternalComponent(vm, options);
    } else {
      // merge类静态的option和传入的option
      vm.$options = mergeOptions(vm.constructor.options, options, vm);
    }

    initLifecycle(vm); // 初始化$children和$parent
    initRender(vm);  // $createElement
    // 数据初始化之前调用
    callHook(vm, 'beforeCreate');

    initState(vm);
    // 初始化完成之后调用
    callHook(vm, 'created');

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
  // const option = {
  //   _isComponent: true,
  //   _parentVnode: vnode,
  //   parent, // activeInstance当前激活的组件实例
  // };
  const opts = vm.$options = Object.create(vm.constructor.options);
  opts.parent = options.parent;
  opts._parentVnode = options._parentVnode;
}