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
### checklist
- [x] 渲染
- [x] 组件
- [x] patch
- [x] diff算法(这里实现了三种方法，react, vue2.x, vue3)
- [x] 响应式
- [x] 生命周期(created, mounted)
- [x] nextTick