async function sleepMilliseconds(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}

// https://stackoverflow.com/questions/38508420/how-to-know-if-a-function-is-async
function isAsyncFunction( fn ) {
  return fn[Symbol.toStringTag] === 'AsyncFunction' || fn instanceof Promise;
}
