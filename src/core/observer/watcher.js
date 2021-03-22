import { Dep } from './dep.js';
import { queueWatcher } from './scheduler.js';

let uid = 0;
// Watch存储mountComponent(vnode+patch)
export class Watcher {
  deps = [];
  depsId = [];
  vm = null;
  id = null;

  constructor (vm, exp, options) {
    Dep.target = this;

    if (options) {
      this.lazy = options.lazy;
    }

    this.vm = vm;
    this.getter = exp;
    this.id = ++uid;
    this.get();
  }

  get () {
    if (this.lazy) {
      // 这里暂时这样写
      console.log('========');
    } else {
      this.getter.call(this.vm);
    }
  }

  addDep (dep) {
    if (!this.depsId.includes(dep.id)) {
      this.depsId.push(dep.id);
      this.deps.push(dep);
      dep.addSub(this);
    }
  }

  update() {
    queueWatcher(this);
  }
}