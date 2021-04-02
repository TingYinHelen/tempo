import { LIFECYCLE_HOOKS, ASSET_TYPES } from '/src/share/constants.js';

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

function mergeAssets (parentVal, childVal) {
  if (childVal) {
    return { ...parentVal, ...childVal }
  } else {
    return { ...parentVal }
  }
}

// 生命周期的merge策略
LIFECYCLE_HOOKS.forEach((hook) => {
  strats[hook] = mergeHook;
});

ASSET_TYPES.forEach((type) => {
  strats[`${type}s`] = mergeAssets;
});


export function mergeOptions (parent, child, vm) {
  const options = {};
  
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