export default {
  tagName(node) {
    return node.tagName;
  },
  parentNode(node) {
    return node.parentNode;
  },
  createElement(tagName, vnode) {
    // 这里的vnode传进来主要是给select用的，一般元素没有用到这个参数
    const elm = document.createElement(tagName);
    
    return elm;
  },
  appendChild(node, child) {
    node.appendChild(child);
  },
  createTextNode(text) {
    return document.createTextNode(text);
  },
  setTextContent(node, text) {
    node.textContent = text;
  },
  removeChild(node, child) {
    node.removeChild(child);
  },
  addChild(node, child) {
    node.appendChild(child);
  },
};
