import Vue from '../src/index.js';
import Vuex from './vuex/index.js';
    
Vue.use(Vuex);
    
const grandChild = {
  render(h) {
    return h('div', {
      style: {
        border: '1px solid red'
      }
    }, 'grandChild')
  }
}
    
const child = {
  components: {grandChild},
  data() {
    return {
      msg: 'Vue'
    };
  },
  render(h) {
    return h('div', { class: 'child' }, [h('grandChild')])
  }
};
    
new Vue({
  el: '#app',
  components: {child},
  store: {
    foo: 'foo',
  },
  render(h) {
    return h('div', {}, [h('child')])
  }
})
console.log(111);