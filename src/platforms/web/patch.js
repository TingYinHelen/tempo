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

function patchData (el, key, nextValue, prevValue) {
  switch (key) {
    case 'style': 
      for (const k in nextValue) {
        el.style[k] = nextValue[k];
      }
      for (const k in prevValue) {
        if (prevValue[k] && !nextValue.hasOwnProperty(k)) {
          el.style[k] = '';
        }
      }
      break;
    case 'class':
      // 这里的class是经过处理的，这个赋值class一定是一个字符串
      el.className = nextValue.class;
      break;
    case 'on':
      for (const k in prevValue) {
        el.removeEventListener(k, prevValue[k]);
      }
      for (const k in nextValue) {
        el.addEventListener(k, nextValue[k]);
      }
      break;
    case 'attrs':
      for (const k in nextValue) {
        el.setAttribute(k, nextValue[k]);
      }
      break;
  }
}

function createElm (vnode, insertedVnodeQueue, parentElm, refNode) {
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

    for (const key in data) {
      patchData(vnode.elm, key, data[key], {});
    }
      
    vnode.children && createChildren(vnode, vnode.children, insertedVnodeQueue);
    
    if (parentElm) {
      refNode ? 
        parentElm.insertBefore(vnode.elm, refNode) 
        : insert(parentElm, vnode.elm);
    }
    
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

function updateChildren (elm, prevChildren, nextChildren) {
  let j = 0;
  let prevEnd = prevChildren.length - 1;
  let nextEnd = nextChildren.length - 1;

  outer: {
    while (prevChildren[j].key === nextChildren[j].key) {
      patchVnode(nextChildren[j], prevChildren[j]);
      j++;
      if (j > nextEnd || j > prevEnd) {
        break outer;
      }
    }
    while (prevChildren[prevEnd].key === nextChildren[nextEnd].key) {
      patchVnode(nextChildren[nextEnd--], prevChildren[prevEnd--]);
      if (j > nextEnd || j > prevEnd) {
        break outer;
      }
    }
  }

  if (prevEnd < j || nextEnd === j) {
    while (j <= nextEnd) {
      createElm (nextChildren[j--], elm, prevChildren[prevEnd + 1].elm);
    }
  } else if (j > nextEnd) {
    while (j <= prevEnd) {
      elm.removeChild(prevChildren[j++].elm);
    }
  } else {
    const nextLeft = nextEnd - j + 1;
    const source = [];
    for (let i = 0; i < nextLeft; i++) {
      source.push(-1);
    }
    const prevStart = j;
    const nextStart = j;
    let pos = 0;
    let move = false;
    const keyIndex = {};
    for (let i = nextStart; i < nextStart; i++) {
      keyIndex[nextChildren[i].key] = i;
    }
    // 遍历旧的children的剩余未处理节点
    for (let i = prevStart; i <= prevEnd; i++) {
      const prevVnode = prevChildren[i];
      // 通过索引表快速找到新的children中key值相等的vnode的位置
      const k = keyIndex[prevVnode.key]
      if (k !== undefined) {
        patch(nextChildren[k], prevVnode);
        // 更新source数组
        source[k - nextStart] = i;
        if (pos > k) {
          move = true;
        } else {
          pos = k;
        }
      } else {
        elm.removeChild(prevChildren[i]);
      }
    }

    if (move) {
      const seq = lis(source);
      // j指向最长递增子序列的最后一个
      let j = seq.length - 1;
      // 从后往前遍历新children中的剩余未处理节点
      for (let i = nextLeft - 1; i > 0; i--) {
        if (source[i] === -1) {
          // 该节点在新 children 中的真实位置索引
          const pos = i + nextStart;
          const nextVNode = nextChildren[pos]
          const nextPos = pos + 1;
          createElm(nextVNode, [], elm, nextChildren[nextPos].elm);
        } else if (i !== seq[j]) {
          // 该节点在新 children 中的真实位置索引
          const pos = i + nextStart;
          const nextVNode = nextChildren[pos];
          // 该节点下一个节点的位置索引
          const nextPos = pos + 1;
          // 移动
          elm.insertBefore(
            nextVNode.el,
            nextPos < nextChildren.length
              ? nextChildren[nextPos].elm
              : null
          )
        } else {
          j--;
        }
      }
    }
  }
}

function patchVnode (vnode, oldVnode) {
  const elm = vnode.elm = oldVnode.elm;

  // patch VnodeData
  const prevData = oldVnode.data;
  const nextData = vnode.data;
  
  for (const key in nextData) {
    const nextValue = nextData[key] || {};
    const prevValue = prevData[key] || {};
    patchData(elm, key, nextValue, prevValue);
  }
  for (const key in prevData) {
    const nextValue = nextData[key] || {};
    const prevValue = prevData[key] || {};
    if (prevValue && !nextValue.hasOwnProperty(key)) {
      patchData(elm, key, nextValue, prevValue);
    }
  }

  // patch children
  const ch = vnode.children;
  const oldCh = oldVnode.children;

  if (ch && oldCh) {
    if (typeof ch === 'string' && typeof oldCh === 'string') {
      if (ch !== oldCh) {
        nodeOps.setTextContent(elm, ch);
      }
    } else {
      updateChildren(elm, oldCh, ch);
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
  // patch = patch + mount
  // oldVnode可能是一个真实的el，则mount
  // 如果有oldVnode和vnode，则执行真实的patch
  // 没有oldVnode
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