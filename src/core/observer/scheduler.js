import { nextTick } from '../utils/nextTick.js';

let queue = [];
let has = {};
let waiting = false;

function resetSchedulerState() {
  queue = [];
  has = {};
  waiting = false;
}

function flushSchedulerQueue () {
  for (const watcher of queue) {
    watcher.get();
  }
  resetSchedulerState();
}

export function queueWatcher (watcher) {
  const id = watcher.id;
  if (!has[id]) {
    has[id] = true;
    queue.push(watcher);
  }
  if (!waiting) {
    waiting = true;
    nextTick(flushSchedulerQueue);
  }
}