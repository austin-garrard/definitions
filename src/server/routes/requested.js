const Router = require('express-promise-router');
const router = new Router();
const db = require('../../db')
const { unwrap } = require('../../db/util')

module.exports = router;

router.get('/', async (req, res) => {
  const actions = {
    potential: 1,
    accepted: 2,
    reported: 3,
    rejected: 4
  }
  const action = actions[req.query.action] || 1

  try {
    const requestedTerms = await unwrap(db, 'SELECT * FROM requested WHERE fulfilled=0 AND action=$1', [action])
    
    res.send(requestedTerms)
  } catch (err) {
    console.log(err)
    res.status(500).send({ message: 'Error while retrieving requested entries' }); //could make more specific
  }
})

const updates = {
  accepted: async function (term) {
    await db.query(
      `UPDATE requested SET action = 2 WHERE term = $1`,
      [term]
    )
    
    return { message: `Accepted term "${term}"` }
  },

  rejected: async function (term) {
    await db.query(
      `UPDATE requested SET action = 4 WHERE term = $1`,
      [term]
    )
    
    return { message: `Rejected term "${term}" :(` }
  }
}

async function create (term) {
  await db.query(
    `INSERT INTO requested(term, fulfilled, action)
     SELECT CAST($1 AS VARCHAR),0,1
     WHERE NOT EXISTS (SELECT 1 FROM requested WHERE term = $1);`,
    [term]);

  return 'added requested term: ' + term
}

async function upsert (term, action, res) {
  const { rows } = await db.query('SELECT * FROM requested WHERE term=$1', [term])
  const alreadyExists = rows.length === 1
  const doAction = alreadyExists ? updates[action] : create
  
  if (doAction) {
    const result = await doAction(term)

    res.send(result)
  } else {
    res.status(400).send({ message: 'Invalid parameters' })
  }
}

router.post('/:term', async (req, res) => {
  const term = req.params.term
  const action = req.query.action

  try {
    await upsert(term, action, res)
  } catch (err) {
    console.log(err)
    res.status(500).send('Error while inserting requested term: ' + term); //could make more specific
  }
})
