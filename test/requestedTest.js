/* eslint-env mocha */

const { expect } = require('chai')
const { post, get } = require('./requestHelper.js')
const { RequestedTerm } = require('../src/server/store/requestedTerm')

describe('Requested term api', () => {
  describe('POST /requested', () => {
    it('should respond with success', async () => {
      const { statusCode, body } = await post('/requested/test124', { json: true })

      expect(statusCode).to.equal(200)
      expect(body).to.eql({ message: 'added requested term: test124' })
    })

    it('should create a requested term', async () => {
      await post('/requested/test124')

      const requestedTerm = await RequestedTerm.get('test124', { json: true })
      expect(requestedTerm).to.eql({
        term: 'test124',
        fulfilled: false
      })
    })

    describe('when something goes wrong', () => {
      it('should respond with an error', async () => {
        await RequestedTerm.put('test124')

        const { statusCode, body } = await post('/requested/test124', { json: true })

        expect(body).to.eql({ message: 'term "test124" already exists' })
        expect(statusCode).to.equal(500)
      })
    })
  })

  describe('GET /requested', () => {
    it('gets all unfulfilled requested terms', async () => {
      await RequestedTerm.put('test1', true)
      await RequestedTerm.put('test2', false)

      const { statusCode, body } = await get('/requested', { json: true })

      expect(statusCode).to.equal(200)
      expect(body).to.eql(['test2'])
    })
  })
})
