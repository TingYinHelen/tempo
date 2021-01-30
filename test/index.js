export const HelloChild = {
  name: 'HelloChild',
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
  data() {
    return {
      createdText: 'HelloVue created',
      mountedText: 'HelloVue mounted',
    };
  },
  created() {
    console.log('created=====', this.createdText);
  },
  mounted() {
    console.log('mounted=====', this.mountedText);
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

