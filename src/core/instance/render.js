import { createElement } from '../vdom/create-element.js';
import { resolveSlots, resolveScopedSlots } from './render-helpers/resolve-slots.js';

export function renderMixin (Vue) {
  Vue.prototype._render = function () {
    const vm = this;
    const { render, _parentVnode } = vm.$options;
    if (_parentVnode) {
      vm.$scopedSlots = resolveScopedSlots(_parentVnode.data.scopedSlots);
    }

    vm.$vnode = _parentVnode;

    let vnode;
    // TODO: _renderProxy
    vnode = render.call(vm, vm.$createElement);

    vnode.parent = _parentVnode;
    return vnode;
  }
}

export function initRender (vm) {
  if (vm.$options._renderChildren) {
    vm.$slots = resolveSlots(vm.$options._renderChildren);
  }
  vm.$createElement = (tag, data, children) => createElement(tag, data, children, vm);
}


