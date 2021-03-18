let timerFunc;
let callbacks = [];
let pending = false;

function flushCallbacks () {
  pending = false;
  for (const cb of callbacks) {
    cb();
  }
  pending = false;
  callbacks = [];
}

if (typeof Promise !== 'undefined') {
  const p = Promise.resolve();
  timerFunc = () => {
    p.then(flushCallbacks);
  };
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks);
  };
}

export function nextTick (cb) {
  callbacks.push(cb);
  if (!pending) {
    pending = true;
    timerFunc();
  }
}