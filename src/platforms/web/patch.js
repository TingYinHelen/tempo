import nodeOps from './node-ops.js';
import VNode from '/src/core/vdom/vnode.js';

function createChildren (vnode, children, insertedVnodeQueue) {
  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      createElm(children[i], insertedVnodeQueue, vnode.elm);
    }
  } else {
    // 文本
    nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(children));
  }
}

function invokeInsertHook (queue) {
  for (let i = 0; i < queue.length; i++) {
    queue[i].data.hooks.insert(queue[i]);
  }
}

function insert (parent, elm) {
  nodeOps.appendChild(parent, elm);
}

function createElm (vnode, insertedVnodeQueue, parentElm) {
  // 递归组件
  if (createComponent(vnode, insertedVnodeQueue, parentElm)) {
    return;
  }

  const { tag, data = {} } = vnode;

  // 如果这里tag有值一定是真实的标签
  // 一定是有tag的vnode才有children
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
      createChildren(vnode, vnode.children, insertedVnodeQueue);
    }
    parentElm && insert(parentElm, vnode.elm);
  }
}

// 工具函数
function createComponent (vnode, insertedVnodeQueue, parentElm) {
  let i = vnode.data;
  if (i) {
    // 组件实例化(如果不是组件，没有mergeHooks的操作，就不走下面的逻辑)
    if ((i = i.hooks) && (i = i.init)) {
      // 让这个vnode生成一个vue实例
      i(vnode);
    }
    
    if (vnode.componentInstance) {
      vnode.elm = vnode.componentInstance.$el;
      insertedVnodeQueue.push(vnode);
      insert(parentElm, vnode.elm);
      return true;
    }
  }
}

function emptyNodeAt(elm) {
  return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm);
}
// oldVnode其实是$el
export function patch (oldVnode, vnode) {
  const insertedVnodeQueue = [];
  // oldVnode没有的时候是组件
  // 组件是没有el
  if (!oldVnode) {
    createElm(vnode, insertedVnodeQueue);
  } else {
    const isRealElement = oldVnode.nodeType;
    // TODO: 这里把所有oldVnode不是真实dom标签的都理解为改变data属性值后的重新渲染
    if (!isRealElement) {
      vnode.elm = oldVnode.elm;
    } else {
      oldVnode = emptyNodeAt(oldVnode); // 生成一个空的，标签吗为oldVnode提供的标签
      const oldElm = oldVnode.elm;
      const parentElm = nodeOps.parentNode(oldElm);
      createElm(
        vnode,
        insertedVnodeQueue,
        parentElm,
      );
    }
  }

  invokeInsertHook(insertedVnodeQueue);  

  return vnode.elm;
}