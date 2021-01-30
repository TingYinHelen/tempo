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
  props: {
    propsTest: 'propsTest',
  },
  data: {
    createdText: 'HelloVue created',
    mountedText: 'HelloVue mounted',
  },
  created() {
    console.log('created=====', this.createdText);
  },
  mounted() {
    console.log('mounted=====', this.mountedText);
    console.log('propsTest=====', this.propsTest);
    setTimeout(() => {
      this.createdText = '测试一下';
      for (const key in this) {
        console.log('key---------', key);
      }
    }, 3000);
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

