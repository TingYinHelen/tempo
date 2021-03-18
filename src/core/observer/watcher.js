import { Dep } from './dep.js';
import { queueWatcher } from './scheduler.js';

let uid = 0;
// Watch存储mountComponent(vnode+patch)
export class Watcher {
  deps = [];
  depsId = [];
  vm = null;
  id = null;

  constructor (vm, exp) {
    Dep.target = this;

    this.vm = vm;
    this.getter = exp;
    this.id = ++uid;
    this.get();
  }

  get () {
    this.getter.call(this.vm);
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