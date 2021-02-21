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

export const HelloVue = {
  name: 'HelloVue',
  data() {
    return {
      show: true,
    };
  },
  mounted() {
    setTimeout(() => {
      this.show = false;
    }, 1000);
  },
  render: function(createElement) {
    return createElement('div', {
      attrs: {
        id: 'HelloVue',
      },
      style: {
        border: '1px solid red',
      },
    }, this.show ? [createElement(HelloH), createElement(HelloChild)] : null);
  },
};

