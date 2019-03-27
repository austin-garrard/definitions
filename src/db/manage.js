// Utilities for managing the dev and test databases

const { executeInSequence } = require('./util');
const { execSync } = require('child_process');

const psql = query => `psql -h localhost -p 5432 -U postgres -d postgres -tAc "${query}"`;
const exec = command => execSync(command).toString().trim();

function createUser (user, pass) {
  const doesUserExist = `SELECT 'exists' FROM pg_roles WHERE rolname='${user}'`;

  if (exec(psql(doesUserExist)) !== 'exists') {
    console.log(`Creating user ${user}...`);
    console.log(exec(psql(`CREATE USER ${user} WITH PASSWORD '${pass}'`)));
  }
}

function deleteUser (user) {
  console.log(`Deleting user ${user}...`);
  console.log(exec(psql(`DROP USER IF EXISTS ${user}`)));
}

function createDb (name) {
  const doesDbExist = `SELECT 'exists' FROM pg_database WHERE datname='${name}'`;
  
  if (exec(psql(doesDbExist)) !== 'exists') {  
    console.log(`Creating database ${name}...`);
    console.log(exec(psql(`CREATE DATABASE ${name}`)));
  }
}

function deleteDb (name) {
  console.log(`Deleting database ${name}...`);
  console.log(exec(psql(`DROP DATABASE IF EXISTS ${name}`)));
}

const tables = {
  'term': 'CREATE TABLE IF NOT EXISTS term(term VARCHAR (60) PRIMARY KEY);',
  'synonym': 'CREATE TABLE IF NOT EXISTS synonym( term VARCHAR (60) NOT NULL, sort_as VARCHAR (60) NOT NULL, PRIMARY KEY (term, sort_as));',
  'author': 'CREATE TABLE IF NOT EXISTS author( author_id SERIAL PRIMARY KEY, name VARCHAR (60), identity VARCHAR (3000));',
  'action': 'CREATE TABLE IF NOT EXISTS action(id SERIAL PRIMARY KEY, title VARCHAR(20));',
  'entry': 'CREATE TABLE IF NOT EXISTS entry(entry_id serial PRIMARY KEY, term VARCHAR (60) NOT NULL REFERENCES term(term), definition VARCHAR (3000) NOT NULL, explanation VARCHAR (3000), author SERIAL REFERENCES author(author_id), action INTEGER NOT NULL REFERENCES action(id), time_submitted TIMESTAMPTZ, last_updated TIMESTAMPTZ);',
  'requested': 'CREATE TABLE IF NOT EXISTS requested( term VARCHAR (60) PRIMARY KEY, fulfilled INTEGER NOT NULL);'
}

// Creates each table if needed
function createTables (pool) {
  const queries = Object.values(tables);

  return executeInSequence(pool, queries);
}

// Delete the content of each table, but leave the table
function truncateTables (pool) {
  const str = Object.keys(tables).join(', ');

  return pool.query(`TRUNCATE ${str} RESTART IDENTITY CASCADE`);
}

function deleteTables (pool) {
  const queries = Object.keys(tables)
    .map(tableName => `DROP TABLE IF EXISTS ${tableName} CASCADE;`);
  
  return executeInSequence(pool, queries);
}

module.exports = {
  createTables,
  truncateTables,
  deleteTables,
  createDb,
  deleteDb,
  createUser,
  deleteUser
};

