const router = require('express').Router()
const { RequestedTerm } = require('../store/requestedTerm')

module.exports = router

router.get('/', async (req, res) => {
  await RequestedTerm.getUnfulfilled()
    .then(results => results.map(result => result.term))
    .then(response => res.json(response))
    .catch(error => res.status(500).json(error))
})

router.post('/:term', async (req, res) => {
  const term = req.params.term
  await RequestedTerm.put(term)
    .then(result => res.json({
      message: `added requested term: ${term}`
    }))
    .catch(error => res.status(500).json({ message: error.message }))
  // let queryString = 'INSERT INTO requested(term, fulfilled) SELECT CAST($1 AS VARCHAR),0 WHERE NOT EXISTS (SELECT 1 FROM requested WHERE term = $1);'
  // let values = [req.params.term];

  // (async () => {
  //  const client = await pool.connect()

  //  try {
  //    await client.query(queryString, values)
  //    res.send('added requested term: ' + values[0])
  //  } finally {
  //    client.release()
  //  }
  // })().catch((err) => {
  //  res.status(500).send('Error while inserting requested term: ' + values[0]) // could make more specific
  //  return console.error('Error executing query', err.stack)
  // })
})
