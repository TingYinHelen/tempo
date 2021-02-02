import { Dep } from './dep.js';

export class Watcher {
  deps = [];
  depsId = [];
  vm = null;

  constructor (vm, exp) {
    Dep.target = this;

    this.vm = vm;
    this.getter = exp;
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
    this.get();
  }
}