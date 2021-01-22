export function initExtend(Vue) {
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    // const { name } = extendOptions;
  
    const Super = this;
    // 子组件的构造函数
    const Sub = function VueComponent (options) {
      this._init(options);
    }
    // 继承vue原型
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
  
    Sub.options = { ...Super.options, ...extendOptions };
  
    Sub.extend = Super.extend;
  
    // if (name) {
    //   Sub.options.components.name = name;
    // }
  
    return Sub;
  }
}
