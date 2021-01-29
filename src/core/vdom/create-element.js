import VNode from './vnode.js';
import { createComponent } from './create-component.js'

export function createElement (tag, data, children, vm) {
    let vnode;
    let ctor;
    // TODO: normalizeChildren
    // children = normalizeChildren(children);
    if (typeof tag === 'string') {
      if (vm.$options.components[tag]) {
        ctor = vm.$options.components[tag];
        vnode = createComponent(ctor, data, vm, children);
      } else {
        vnode = new VNode(tag, data, children, undefined, undefined, vm);
      }
    } else {
      // 生成组建vnode
      // 这里的tag是子组件的组件对象(第一次就是HelloVue)
      vnode = createComponent(tag, data, vm, children);
    }

    return vnode;
}