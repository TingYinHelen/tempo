import { initExtend } from './extend.js';
export function initGlobalAPI(Vue) {
  Vue.options = Object.create(null);
  Vue.options._base = Vue;

  initExtend(Vue);
}