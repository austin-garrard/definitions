const { Pool } = require('pg');

function connectionPool(connectionString, ssl) {
  return new Pool({
    connectionString: connectionString,
    ssl: ssl
  });
}

module.exports = connectionPool;

