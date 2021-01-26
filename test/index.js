export const HelloChild = {
  name: 'HelloChild',
  created() {
    console.log('HelloChild====');
  },
  render: function (createElement) {
    return createElement('div', {
      attrs: {
        id: 'HelloChild',
      },
      style: {
        border: '1px solid blue',
      }
    }, 'HelloChild=====');
  },
};

export const HelloH = {
  name: 'HelloH',
  created() {
    console.log('HelloH====');
  },
  render: function (createElement) {
    return createElement('h1', {
      attrs: {
        id: 'h',
      },
      style: {
        border: '1px solid blue',
      }
    }, 'HelloH=====');
  },
};

export const HelloVue = {
  name: 'HelloVue',
  components: { HelloChild },
  created() {
    console.log('HelloVue');
  },
  render: function(createElement) {
    return createElement('div', {
      attrs: {
        id: 'HelloVue',
      },
      style: {
        border: '1px solid red',
      },
    }, [createElement(HelloChild), createElement(HelloH)]);
  },
};

