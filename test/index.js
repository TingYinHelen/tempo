export const HelloChild = {
  name: 'HelloChild',
  created() {
    console.log('HelloChild created');
  },
  mounted() {
    console.log('HelloChild mounted');
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
    console.log('HelloH created');
  },
  mounted() {
    console.log('HelloH mounted');
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
    console.log('HelloVue created');
  },
  mounted() {
    console.log('HelloVue mounted');
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

