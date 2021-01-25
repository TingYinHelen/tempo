import { initMixin } from './init.js';
import { lifecycleMixin } from './lifecycle.js';
import { renderMixin } from './render.js';

function Vue (options) {
  this._init(options);
}

// 声明初始化一些方法，一下方法都是给Vue的prototype上扩展一些方法。
// 这里按照功能把这些扩展分散到多个模块中去实现，而不是在一个模块中实现所有。
// 这种用class不好实现，这样做的好处就是非常方便代码的维护和管理
initMixin(Vue); // _init
lifecycleMixin(Vue); // _update
renderMixin(Vue); // _render

export default Vue;
