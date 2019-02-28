/* eslint-env mocha */

const { expect } = require('chai')
const { get } = require('./requestHelper')

describe('Reported route', () => {
  // TODO make this a real test
  it('should return currently reported entries with an action code of 4', async () => {
    const { statusCode, body } = await get('/reported', { json: true })

    expect(statusCode).to.eql(200)
    expect(body).to.eql([])
  })
})
