#!/usr/bin/env node

// Clean up development database - tables
const configFor = require('../src/db/config');
const { deleteUser, deleteDb, deleteTables } = require('../src/db/manage');

function clean(config) {
  deleteDb(config.name);
  deleteUser(config.user);
}

clean(configFor('development'));
clean(configFor('test'));

