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
      borderStyle: '1px solid red',
    };
  },
  mounted() {
    setTimeout(() => {
      this.borderStyle = '10px dashed';
    }, 1000);
  },
  render: function(createElement) {
    return createElement('div', {
      attrs: {
        id: 'HelloVue',
      },
      style: {
        border: this.borderStyle,
      },
      on: {
        click: function() {
          alert(11);
        },
      },
    }, this.show ? [createElement(HelloH), createElement(HelloChild)] : null);
  },
};

