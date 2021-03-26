export function initUse (Vue) {
  Vue.use = function (plugin, ...arg) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }
    arg.unshift(this);
    if (Object.prototype.toString.call(plugin).indexOf('Function') > 0) {
      plugin.apply(null, arg);
    } else if (Object.prototype.toString.call(plugin.install).indexOf('Function') > 0) {
      plugin.install.apply(null, arg);
    }
    installedPlugins.push(plugin)
    return this;
  }
}