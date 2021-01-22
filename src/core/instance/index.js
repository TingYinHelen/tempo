import { initMixin } from './init.js';
import { lifecycleMixin } from './lifecycle.js';
import { renderMixin } from './render.js';

class Vue {
  constructor(options) {
    this._init(options);
  }
}

// 声明初始化一些方法
initMixin(Vue); // _init
lifecycleMixin(Vue); // _update
renderMixin(Vue); // _render

export default Vue;
