### Tempo

```javascript
import Tempo from 'tempo';

new Tempo({
  id: '#app',
  render: function(h) {
    return h('div', {
      style: {
        border: '1px solid red',
      },
    }, 'hello Tempo');
  },
})
```