export const HelloChild = {
  name: 'HelloChild',
  render: function (createElement) {
    return createElement('div', {
      attrs: {
        id: 'HelloChild',
      },
      style: {
        border: '1px solid green',
      }
    }, 'HelloChild=====');
  },
};

export const HelloH = {
  name: 'HelloH',
  data() {
    return {
      hello: 'HelloVue',
    };
  },
  // mounted() {
  //   setTimeout(() => {
  //     this.hello = '测试一下';
  //   }, 1000);
  // },
  render: function (createElement) {
    return createElement('h1', {
      attrs: {
        id: 'h',
      },
      style: {
        border: '1px solid blue',
      }
    }, this.hello);
  },
};

export const Hello = {
  name: 'Hello',
  data() {
    return {
      childList: ['a', 'b', 'c'],
    };
  },
  // ba
  mounted() {
    setTimeout(() => {
      this.childList = ['d', 'a', 'c', 'b'];
    }, 1000);
  },
  render: function(h) {
    return h('ul', {
    }, this.childList.map((child) => h('li', {key: child}, child)));
  },
};

