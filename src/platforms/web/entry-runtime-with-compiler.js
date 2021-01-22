import Vue from '/src/core/index.js';
import { mountComponent } from '/src/core/instance/lifeCycle.js';
import { patch } from '/src/platforms/web/patch.js';

Vue.prototype.__patch__ = patch;
// 因为不同的plat $mount方法不同所以将该方法定义在该文件
Vue.prototype.$mount = function (el) {
    el = document.querySelector(el);
    
    const options = this.$options;

    if (!options.render) {
      let template = options.template;
      // TODO: compileToFunctions
      if (template) {
        const { render } = compileToFunctions(template);
        options.render = render;
      }
    }

    return mountComponent(this, el);
}

export default Vue;