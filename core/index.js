class Vue {
  constructor(option) {
    this._data = option.data;
    observer(this._data, option.render);
  }
}

function observer(data, cb) {
  Object.keys(data).forEach((key) => defineReactive(data, key, data[key], cb));
}

function defineReactive(data, key, value, cb) {
  Object.defineProperty(data, key, {
    get() {
      // 收集依赖
      return value;
    },
    set(newVal) {
      value = newVal;
      cb(); // set的时候执行render
    },
  });
}

const app = new Vue({
  el: '#app',
  data: {
    text: 'text',
    text2: 'text2',
  },
  render() {
    console.log('render======');
  },
});
app._data.text2 = 'test------';
console.log('app._data: ', app._data.text2);
