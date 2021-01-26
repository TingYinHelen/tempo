import { LIFECYCLE_HOOKS } from '/src/share/constants.js';

const defaultStrat = (parentVal, childVal) => {
  return childVal ? childVal : parentVal;
};

const strats = {};

function mergeHook (parentVal, childVal) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
}

LIFECYCLE_HOOKS.forEach((hook) => {
  strats[hook] = mergeHook;
});

export function mergeOptions (parent, child, vm) {
  const options = {};
  // TODO: 暂时只实现了生命周期钩子
  for (const key in parent) {
    mergeField(key);
  }

  for (const key in child) {
    if (!hasOwnProperty.call(parent, key)) {
      mergeField(key);
    }
  }

  function mergeField (key) {
    const strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key]);
  }

  return options;
}