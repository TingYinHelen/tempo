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
  const ob = new Observer(value);
}

function defineReactive (obj, key, val) {
  const dep = new Dep();

  // const property = Object.getOwnPropertyDescriptor(obj, key);
  // const getter = property.get;
  // const setter = property.set;

  // console.log('getter: ', getter);
  // console.log('setter: ', setter);
  
  Object.defineProperty(obj, key, {
    get () {
      console.log('$options observe get--');
      dep.depend();
      return val;
    },
    set (newVal) {
      console.log('$options observe set==', val);
      val = newVal;
      console.log('================', obj[key]);
      debugger
      dep.notify();
    }, 
  });
}
