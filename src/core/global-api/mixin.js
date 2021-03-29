import { mergeOptions } from '../utils/options.js';

export function initMixin (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this;
  }
}