import nodeOps from './node-ops.js';
import VNode from '/src/core/vdom/vnode.js';

function createChildren (vnode, children, insertedVnodeQueue) {
  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      createElm(children[i], vnode.elm);
    }
  } else {
    // 文本
    nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(children));
  }
}

function insert (parent, elm) {
  nodeOps.appendChild(parent, elm);
}

function createElm (vnode, parentElm) {
  if (createComponent(vnode, parentElm)) {
    return;
  }

  const { tag, data = {} } = vnode;

  // 如果这里tag有值一定是真实的标签
  if (tag) {
    vnode.elm = nodeOps.createElement(tag, vnode);

    // TODO: 暂时这么写，后面需要改为updateAttrs
    const { style, attrs } = data;
    for (const key in attrs) {
      vnode.elm.setAttribute(key, attrs[key]);
    }
    for (const key in style) {
      vnode.elm.style[key] = style[key];
    }

    if (vnode.children) {
      createChildren(vnode, vnode.children);
    } else {
      insert(parentElm, vnode.elm);
    }
  }
  // 工具函数

  function createComponent (vnode, parentElm) {
    let i = vnode.data;
    if (i) {
      // 组件实例化(如果不是组件，没有mergeHooks的操作，就不走下面的逻辑)
      if ((i = i.hooks) && (i = i.init)) {
        // 让这个vnode生成一个vue实例
        i(vnode);
      }
      // vnode.componentInstance在上一步执行
      if (vnode.componentInstance) {
        // TODO: 这里vnode.elm为空(暂时不知道为什么为空，用vnode.componentInstance.$el代替)
        insert(parentElm, vnode.componentInstance.$el);
        return true;
      }
    }
  }
}

export function patch (oldVnode, vnode) {
    // oldVnode没有的时候是组件
    // 组件是没有el
    if (!oldVnode) {
      createElm(vnode);
    } else {
      oldVnode = emptyNodeAt(oldVnode); // 生成一个空的，标签吗为oldVnode提供的标签
      const oldElm = oldVnode.elm;
      const parentElm = nodeOps.parentNode(oldElm);
      createElm(
        vnode,
        parentElm,
      );
    }

    // 工具函数
    function emptyNodeAt(elm) {
      return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm);
    }

    function createComponent (vnode, parentElm) {
      let i = vnode.data;
      if (i) {
        // 组件实例化(如果不是组件，没有mergeHooks的操作，就不走下面的逻辑)
        if ((i = i.hooks) && (i = i.init)) {
          // 让这个vnode生成一个vue实例
          i(vnode);
        }
        // vnode.componentInstance在上一步执行
        if (vnode.componentInstance) {
          // TODO: 这里vnode.elm为空(暂时不知道为什么为空，用vnode.componentInstance.$el代替)
          insert(parentElm, vnode.componentInstance.$el);
          return true;
        }
      }
    }

    function createElm (vnode, parentElm) {
      if (createComponent(vnode, parentElm)) {
        return;
      }
    
      const { tag, data = {} } = vnode;
    
      // 如果这里tag有值一定是真实的标签
      if (tag) {
        vnode.elm = nodeOps.createElement(tag, vnode);
    
        // TODO: 暂时这么写，后面需要改为updateAttrs
        const { style, attrs } = data;
        for (const key in attrs) {
          vnode.elm.setAttribute(key, attrs[key]);
        }
        for (const key in style) {
          vnode.elm.style[key] = style[key];
        }
    
        if (vnode.children) {
          createChildren(vnode, vnode.children);
        } else {
          insert(parentElm, vnode.elm);
        }
      }
    }
    return vnode.elm;
}