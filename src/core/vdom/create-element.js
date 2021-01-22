import VNode from './vnode.js';
import { createComponent } from './create-component.js'

export function createElement (tag, data, children, vm) {
    let vnode;
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

    return vnode;
}