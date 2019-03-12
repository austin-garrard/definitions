const pool = require('../src/db');
const { truncateTables } = require('../src/db/manage');

beforeEach(async function resetDb() {
  await truncateTables(pool);
});

after(() => pool.end())

const app = require('../src/server/index')
const TEST_PORT = 4000;
const startApp = () => app.listen(TEST_PORT, () => {
    console.log(`Tests running on port ${TEST_PORT}`);
});
const tearDown = () => app.listen().close();

startApp();
require('./authorTest')();
require('./reportedTest')();
require('./requestedTest')();
//require('./synonymsTest')();
//require('./termsTest')();
require('./entriesTest');
tearDown();
