export function initExtend(Vue) {
  Vue.extend = function (extendOptions) {
    // 将传入的extendOptions放在Sub的静态属性上
    extendOptions = extendOptions || {};
    // const { name } = extendOptions;
  
    const Super = this;
    // 子组件的构造函数
    // 这里用function的形式来定义Sub类，是给Sub.prototype赋值不会报错
    const Sub = function VueComponent (options) {
      this._init(options);
    };
    // 继承vue原型
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    // 把传入的Ctor放在静态属性上，后面new实例的时候会把它放到$options上
    Sub.options = { ...Super.options, ...extendOptions };
  
    Sub.extend = Super.extend;
  
    // if (name) {
    //   Sub.options.components.name = name;
    // }
  
    return Sub;
  }
}
