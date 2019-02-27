
function createRequestedTerm (db, log) {
  const extractRows = result => result.rows

  const formatFields = records => records.map(
    record => Object.assign(record, {
      fulfilled: record.fulfilled === 1
    })
  )

  const firstOrNull = records => records.length === 0 ? null : records[0]

  const success = () => true

  const failure = term => error => {
    const errors = {
      '22001': 'term is greater than 60 characters',
      '23505': `term "${term}" already exists`
    }

    let message = errors[error.code]

    if (!message) {
      log(error)
      message = 'an unknown error occurred'
    }
    log(`[ERROR][RequestedTerm] ${message}`)

    return {
      success: false,
      message: message
    }
  }

  return {
    get: function (term) {
      return db
        .query(`SELECT * FROM requested WHERE term=$1`, [term])
        .then(extractRows)
        .then(formatFields)
        .then(firstOrNull)
        .catch(failure(term))
    },

    put: function (term, requested = false) {
      const _requested = requested ? 1 : 0

      return db
        .query(
          `INSERT INTO requested(term, fulfilled)
          VALUES ($1, $2)`,
          [term, _requested]
        )
        .then(success)
        .catch(failure(term))
    }
  }
}

const pool = require('../../db')
const RequestedTerm = createRequestedTerm(pool, console.log)

module.exports = {
  createRequestedTerm,
  RequestedTerm
}
