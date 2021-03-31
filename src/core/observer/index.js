import { Dep } from "./dep.js";

class Observer {
  constructor(value) {
    this.walk(value);  
  }

  walk(obj) {
    for (const key in obj) {
      defineReactive(obj, key, obj[key]);
    }
  }
}

export function observe (value) {
  if (typeof value !== 'object') return ;
  const ob = new Observer(value);
}

function defineReactive (obj, key, val) {
  observe(obj[key])
  const dep = new Dep();

  // const property = Object.getOwnPropertyDescriptor(obj, key);
  // const getter = property.get;
  // const setter = property.set;

  
  Object.defineProperty(obj, key, {
    get () {
      dep.depend();
      return val;
    },
    set (newVal) {
      val = newVal;
      dep.notify();
    }, 
  });
}
