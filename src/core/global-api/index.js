import { ASSET_TYPES } from '/src/share/constants.js';
import { initExtend } from './extend.js';
import { initAssetRegisters } from './assets.js';

export function initGlobalAPI(Vue) {
  Vue.options = Object.create(null);
  Vue.options._base = Vue;

  initExtend(Vue);

  ASSET_TYPES.forEach(type => {
    Vue.options[`${type}s`] = Object.create(null);
  });

  // 全局组件，指令等
  initAssetRegisters(Vue);
}