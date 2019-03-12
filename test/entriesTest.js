
const { expect } = require('chai')
const request = require('request')
const { get, post } = require('./requestHelper')
const db = require('../src/db')

describe('Entries route' ,() => {

  beforeEach(async () => {
    await db.query(`INSERT INTO action(id, title) VALUES(0, 'Status 1')`)
    await db.query(`INSERT INTO action(title) VALUES('Status 2')`)
  })

  describe('POST /entries', () => {
    const requestBody = {
      term: 'cool term',
      definition: 'it is super cool',
      time_submitted: new Date('January 19, 1992'),
      action: 0,
      identity: 'pretty queer',
      explanation: 'this is a really useful term, im sure of it'
    }

    it('responds with success', async () => {
      const { statusCode, body } = await post('/entries', {
        body: requestBody 
      })

      expect(body).to.eql('Inserted entry for term: cool term')
      expect(statusCode).to.eql(200)
    })

    it('creates a term', async () => {
      const { statusCode, body } = await post('/entries', {
        body: requestBody 
      })

      expect(body).to.eql('Inserted entry for term: cool term')
      expect(statusCode).to.eql(200)
    })
  })
})

