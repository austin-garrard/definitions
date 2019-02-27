/* eslint-env mocha */

const { expect } = require('chai')
const pool = require('../../src/db')
const { createRequestedTerm } = require('../../src/server/store/requestedTerm')

describe('Requested term store', () => {
  let logs
  const log = message => logs.push(message)

  let RequestedTerm

  beforeEach(() => {
    logs = []

    RequestedTerm = createRequestedTerm(pool, log)
  })

  describe('get', () => {
    it('returns null when the term is not found', async () => {
      const term = await RequestedTerm.get('term that no exist')

      expect(term).to.eql(null)
    })

    it('returns the term when it is found', async () => {
      await pool.query(`INSERT INTO requested(term, fulfilled)
                        VALUES ('term that do exist, light be praised', 0)`)

      const term = await RequestedTerm.get('term that do exist, light be praised')

      expect(term).to.eql({
        term: 'term that do exist, light be praised',
        fulfilled: false
      })
    })

    it('shows the term as fulfilled when its value is 1', async () => {
      await pool.query(`INSERT INTO requested(term, fulfilled)
                        VALUES ('term that do exist, light be praised', 1)`)

      const term = await RequestedTerm.get('term that do exist, light be praised')

      expect(term).to.eql({
        term: 'term that do exist, light be praised',
        fulfilled: true
      })
    })

    describe('when something catastrophic happens', () => {
      const rawError = {
        message: 'oh noes!',
        stack: 'stacktrace',
        code: '666'
      }

      let naughtyDb = {
        query: () => Promise.reject(rawError)
      }

      beforeEach(() => {
        RequestedTerm = createRequestedTerm(naughtyDb, log)
      })

      it('returns an error', async () => {
        const result = await RequestedTerm.get('great term')

        expect(result).to.eql({
          success: false,
          message: 'an unknown error occurred'
        })
      })

      it('logs the raw error object', async () => {
        await RequestedTerm.get('great term')

        expect(logs).to.eql([
          rawError,
          '[ERROR][RequestedTerm] an unknown error occurred'
        ])
      })
    })
  })

  describe('put', () => {
    it('inserts unfulfilled terms', async () => {
      const result = await RequestedTerm.put('great term')
      expect(result).to.eql(true)

      const term = await RequestedTerm.get('great term')
      expect(term).to.eql({
        term: 'great term',
        fulfilled: false
      })
    })

    it('optionally inserts fulfilled terms', async () => {
      const result = await RequestedTerm.put('great term', true)
      expect(result).to.eql(true)

      const term = await RequestedTerm.get('great term')
      expect(term).to.eql({
        term: 'great term',
        fulfilled: true
      })
    })

    describe('when the term is longer than 60 characters', () => {
      const term = 'q'.repeat(61)

      it('returns an error', async () => {
        const result = await RequestedTerm.put(term)
        expect(result).to.eql({
          success: false,
          message: 'term is greater than 60 characters'
        })
      })

      it('does not create a term', async () => {
        await RequestedTerm.put(term)
        const result = await pool.query(`SELECT COUNT(*) FROM requested`)

        expect(result.rows[0]).to.eql({ count: '0' })
      })

      it('logs what happened', async () => {
        await RequestedTerm.put(term)

        expect(logs).to.eql(['[ERROR][RequestedTerm] term is greater than 60 characters'])
      })
    })

    describe('when the term already exists', () => {
      const term = 'great term'

      beforeEach(async () => {
        await RequestedTerm.put(term, true)
      })

      it('returns an error', async () => {
        const result = await RequestedTerm.put(term)
        expect(result).to.eql({
          success: false,
          message: 'term "great term" already exists'
        })
      })

      it('does not create a new term', async () => {
        await RequestedTerm.put(term)

        const result = await pool.query(`SELECT COUNT(*) FROM requested`)

        expect(result.rows[0]).to.eql({ count: '1' })
      })

      it('does not update the existing term', async () => {
        await RequestedTerm.put(term)

        const existingTerm = await RequestedTerm.get(term)

        expect(existingTerm).to.eql({
          term: 'great term',
          fulfilled: true
        })
      })

      it('logs what happened', async () => {
        await RequestedTerm.put(term)

        expect(logs).to.eql(['[ERROR][RequestedTerm] term "great term" already exists'])
      })
    })

    describe('when something catastrophic happens', () => {
      const rawError = {
        message: 'oh noes!',
        stack: 'stacktrace',
        code: '666'
      }

      let naughtyDb = {
        query: () => Promise.reject(rawError)
      }

      beforeEach(() => {
        RequestedTerm = createRequestedTerm(naughtyDb, log)
      })

      it('returns an error', async () => {
        const result = await RequestedTerm.put('great term')

        expect(result).to.eql({
          success: false,
          message: 'an unknown error occurred'
        })
      })

      it('logs the raw error object', async () => {
        await RequestedTerm.put('great term')

        expect(logs).to.eql([
          rawError,
          '[ERROR][RequestedTerm] an unknown error occurred'
        ])
      })

      it('does not create a new term', async () => {
        await RequestedTerm.put('great term')

        const result = await pool.query(`SELECT COUNT(*) FROM requested`)

        expect(result.rows[0]).to.eql({ count: '0' })
      })
    })
  })
})
