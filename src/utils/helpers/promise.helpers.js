async function callSequentially(promises) {
  // eslint-disable-next-line no-restricted-syntax
  for (const promise of promises) {
    // eslint-disable-next-line no-await-in-loop
    await promise;
  }
}

const PromiseHelper = {
  callSequentially,
};

module.exports = PromiseHelper;
