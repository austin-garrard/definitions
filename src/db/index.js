const env = process.env.NODE_ENV || 'development';
console.log(`Loading DB config for ${env}`);
const config = require('./config')(env);
const connectionPool = require('./connectionPool');

let connectionString;
if (process.env.DATABASE_URL) {
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = config.connectionString;
  // A lot of the app still uses this env variable directly,
  // so we set it manually to prevent everything breaking
  // while we mess around with db config
  process.env.DATABASE_URL = config.connectionString;
}

module.exports = connectionPool(connectionString, config.ssl);
