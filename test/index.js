/* eslint-env mocha */

const path = require('path')
const glob = require('glob')
const pool = require('../src/db')
const { truncateTables } = require('../src/db/manage')

before(async function startTestServer () {
  // TODO requiring the server actually starts it,
  // so currently 2 servers are started and then the
  // tests query the one running on 4000. The server
  // index will have to be restructured to avoid this.
  //
  // Additionally, if proper setup & teardown is desired,
  // we will have to structure the server index like this:
  // https://github.com/expressjs/express/issues/1101#issuecomment-13668964
  const app = require('../src/server')
  const TEST_PORT = 4000

  await new Promise(resolve => {
    app.listen(TEST_PORT, () => {
      console.log(`Test server running on port ${TEST_PORT}`)
      resolve()
    })
  })
})

beforeEach(async function resetDb () {
  await truncateTables(pool)
})

// require all tests
glob.sync('./test/**/*Test.js').forEach(function (file) {
  require(path.resolve(file))
})
