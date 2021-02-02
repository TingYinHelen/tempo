export class Dep {
  static target = null;
  id = 0;
  sub = [];

  constructor () {
    this.id++;
  }

  depend () {
    Dep.target.addDep(this);
  }

  addSub (watch) {
    this.sub.push(watch);
  }

  notify () {
    for (const watcher of this.sub) {
      watcher.update();
    }
  }
}