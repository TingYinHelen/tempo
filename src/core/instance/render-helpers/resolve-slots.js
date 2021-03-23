export function resolveSlots (chidren) {
  const slot = {};
  for (const child of chidren) {
    if (child.data.slot) {
      slot[child.data.slot] = [child];
    }
  }
  return slot;
}

export function resolveScopedSlots (scopedSlots) {
  const res = {};
  for (const key in scopedSlots) {
    res[key] = scopedSlots[key];
  }
  return res;
}