/* eslint-env mocha */

const { expect } = require('chai')
const { post, get } = require('./requestHelper.js')
const { RequestedTerm } = require('../src/server/store/requestedTerm')

describe('Requested term api', () => {
  describe('POST /requested', () => {
    it('should respond with success', async () => {
      const { statusCode, body } = await post('/requested/test124')

      expect(statusCode).to.equal(200)
      expect(body).to.equal('added requested term: test124')
    })

    it('should create a requested term', async () => {
      await post('/requested/test124')

      const requestedTerm = await RequestedTerm.get('test124')
      expect(requestedTerm).to.eql({
        term: 'test124',
        fulfilled: false
      })
    })
  })

  describe('GET /requested/:term', () => {
    it('should look up the term by name', async () => {
      await RequestedTerm.put('test124')

      const { statusCode, body } = await get('/requested', { json: true })

      expect(statusCode).to.equal(200)
      expect(body).to.eql(['test124'])
    })
  })
})
