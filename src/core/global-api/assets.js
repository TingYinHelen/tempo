import { ASSET_TYPES } from '/src/share/constants.js';

export function initAssetRegisters (Vue) {
  ASSET_TYPES.forEach((type) => {
    Vue[type] = function (id, definition) {
      if (type === 'component') {
        definition.name = definition.name || id;
        definition = this.options._base.extend(definition);
      }
      Vue.options[`${type}s`][id] = definition;
    }
  });
}