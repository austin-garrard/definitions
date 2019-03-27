
// Chains queries together using the given connection pool
//   - Is NOT transactional
//   - Re-throws errors
function executeInSequence (pool, queries) {
  return queries
    .reduce(
      (chain, q) => chain.then(() => pool.query(q)),
      Promise.resolve())
    .catch(e => setImmediate(() => {throw e}));
}


module.exports = {
 executeInSequence 
}
