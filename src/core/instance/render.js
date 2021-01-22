import { createElement } from '../vdom/create-element.js';

export function renderMixin (Vue) {
  Vue.prototype._render = function () {
    const vm = this;
    const { render, _parentVnode } = vm.$options;

    vm.$vnode = _parentVnode;

    let vnode;
    // TODO: _renderProxy
    vnode = render(vm.$createElement);

    vnode.parent = _parentVnode;
    return vnode;
  }
}

export function initRender (vm) {
  // TODO: $createElement为什么不是原型上的方法 (需要把this传进去)
  vm.$createElement = (tag, data, children) => createElement(tag, data, children, vm);
}
