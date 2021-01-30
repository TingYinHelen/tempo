export function initState (vm) {
  const { data, props } = vm.$options;
  props && initProps(vm, props);
  data && initData(vm, data);
  
  // console.log('data: ', data);
  // for (const key in data) {
  //   Object.defineProperty(vm, key, {
  //     configurable: true,
  //     enumerable: true,
  //     get() {
  //       return data[key];
  //     },
  //     set(val) {
  //       vm.$options.data[key] = val;
  //     },
  //   });
  // }
}
function initProps (vm, propsOptions) {
  for (const key in propsOptions) {
    proxy(vm, 'props', key);
  }
}
function initData (vm, data) {
  data = typeof data === 'function' ? getData(vm, data) : data;
  for (const key in data) {
    proxy(vm, 'data', key);
  }
  proxy(vm, data);
}
function getData (vm, data) {
  return data.call(vm);
}
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: null,
  set: null
}
function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function () {
    return this.$options[sourceKey][key];
  }
  sharedPropertyDefinition.set = function (val) {
    this.$options[sourceKey][key] = val;
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}