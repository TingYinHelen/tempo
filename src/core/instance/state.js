import { observe } from '../observer/index.js';

export function initState (vm) {
  const { data, props } = vm.$options;
  props && initProps(vm, props);
  data && initData(vm);
}
function initProps (vm, propsOptions) {
  for (const key in propsOptions) {
    proxy(vm, 'props', key);
  }
}
function initData (vm) {
  let { data } = vm.$options;
  data = vm.$options.data = typeof data === 'function' ? getData(vm, data) : data;
  for (const key in data) {
    proxy(vm, 'data', key);
  }
  observe(data);
}
function getData (vm, data) {
  return data.call(vm);
}
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: null,
  set: null,
}
function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function () {
    console.log('proxy get');
    return this.$options[sourceKey][key];
  }
  sharedPropertyDefinition.set = function (val) {
    console.log('val: -----', val);
    console.log('proxy set');
    this.$options[sourceKey][key] = val;
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}