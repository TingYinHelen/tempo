export function install (Vue) {
  if (install.installed) return;
  install.installed = true;

  Vue.mixin({
    beforeCreate() {},
    destroyed() {},
  });

  Object.defineProperty(this, '$router', {
    get() {}
  })
  Object.defineProperty(this, '$route', {
    get() {}
  })

  Vue.components('RouterView', View)
  Vue.components('RouterLink', Link)
}
