import { ASSET_TYPES } from '/src/share/constants.js';
import { initExtend } from './extend.js';
import { initAssetRegisters } from './assets.js';
import { initUse } from './use.js';
import { initMixin } from './mixin.js';

export function initGlobalAPI(Vue) {
  Vue.options = Object.create(null);
  Vue.options._base = Vue;

  initUse(Vue);
  initExtend(Vue);
  initMixin(Vue);

  ASSET_TYPES.forEach(type => {
    Vue.options[`${type}s`] = Object.create(null);
  });

  // 全局组件，指令等
  initAssetRegisters(Vue);
}