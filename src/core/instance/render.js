import { createElement } from '../vdom/create-element.js';

export function renderMixin (Vue) {
  Vue.prototype._render = function () {
    const vm = this;
    const { render, _parentVnode } = vm.$options;

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
    vm.$slots = resolveSlots(vm.$options._renderChildren, vm);
  }
  vm.$createElement = (tag, data, children) => createElement(tag, data, children, vm);
}

function resolveSlots (chidren, vm) {
  const slot = {};
  for (const child of chidren) {
    if (child.data.slot) {
      slot[child.data.slot] = [child];
    }
  }
  return slot;
}
