import { observe } from '../observer/index.js';
import { Watcher } from '../observer/watcher.js';

export function initState (vm) {
  const { data, props, computed } = vm.$options;
  props && initProps(vm, props);
  data && initData(vm);
  computed && initComputed(vm, computed);
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

function initComputed (vm, computed) {
  for (const key in computed) {
    const getter = computed[key];
    new Watcher(vm, getter);
    if (!(key in vm)) {
      defineComputed(vm, key, getter);
    } else {
      console.warn('计算属性与与data中的属性命名冲突');
    }
  }
}

function defineComputed (vm, key, get) {
  Object.defineProperty(vm, key, { get });
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
    return this.$options[sourceKey][key];
  }
  sharedPropertyDefinition.set = function (val) {
    this.$options[sourceKey][key] = val;
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}