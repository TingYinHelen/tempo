let Vue;

export class Store {
  get state () {
    return this._vm.$$state
  }
  constructor(options) {
    this._wrappedGetters = Object.create(null)

    for (const key in options.getters) {
      registerGetter(this, key, options.getters[key])
    }

    resetStoreVM(this, options.state)
  }  
}

function resetStoreVM (store, state) {
  const computed = {};
  store.getters = {};

  for (const key in store._wrappedGetters) {
    computed[key] = store._wrappedGetters[key]
    Object.defineProperty(store.getters, key, {
      get () {
        return store._vm[key]
      }
    })
  }

  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed,
  })
}

function registerGetter (store, key, getter) {
  store._wrappedGetters[key] = function () {
    return getter(store.state)
  }
}

export function install (_Vue) {
  Vue = _Vue
  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        this.$store = this.$options.store;
      } else if (this.$parent && this.$parent.$store) {
        this.$store = this.$parent.$store;
      }
    }
  })
}