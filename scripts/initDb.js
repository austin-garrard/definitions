#!/usr/bin/env node

const configFor = require('../src/db/config');
const connectionPool = require('../src/db/connectionPool');
const { connectLocal, createUser, createDb, createTables } = require('../src/db/manage');

let envs = process.argv.slice(2);
if (envs.length === 0) {
  envs = ['development', 'test']
}

async function initialize(config) {
  createUser(config.user, config.pass);
  createDb(config.name);
  
  // We only try to start a connection pool after the db has been created
  const pool = connectionPool(config.connectionString, config.ssl);

  // We also close the pool so the script will end immediately
  await createTables(pool).then(() => pool.end());
}

envs.forEach(env => initialize(configFor(env)));

