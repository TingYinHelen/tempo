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
  // 1. 首先把vnode全部当做组件处理
  // 2. 如果组件创建失败，则检查tag是否有定义，如果有则按照一般标签处理
  // 3. 如果没有定义tag，则检查是否是注释，如果不是注释，则当做文本处理
  
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
function patchVnode (vnode, oldVnode) {
  const elm = vnode.elm = oldVnode.elm;
  const data = vnode.data;
  const ch = vnode.children;
  const oldCh = oldVnode.children;

  if (ch && oldCh) {
    if (typeof ch === 'string' && typeof oldCh === 'string') {
      nodeOps.setTextContent(elm, ch);
    } else {
      // TODO:
      // updateChildren
    }
  } else if (ch) {
    for (const child of oldCh) {
      nodeOps.removeChild(elm, child.elm);
    }
    for (const child of ch) {
      nodeOps.addChild(elm, child.elm);
    }
  } else if (oldCh) {
    for (const child of oldCh) {
      nodeOps.removeChild(elm, child.elm);
    }
  }
  // TODO: vnodedata的比对没有写
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
    if (!isRealElement) {
      patchVnode(vnode, oldVnode);
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