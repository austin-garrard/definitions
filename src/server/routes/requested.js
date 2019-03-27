const Router = require('express-promise-router');
const router = new Router();
const pool = require('../../db')

module.exports = router;

router.get('/', async (req, res) => {

  let query = {
      text:'SELECT * FROM requested WHERE fulfilled=0',
      rowMode: 'array'
  };

    (async () => {
        const client = await pool.connect();

        try {
            const result = await client.query(query);
            res.send(result.rows.map(term_array => {return term_array[0]}));
        } finally {
            client.release();
        }
    })().catch((err) => {
        res.status(500).send('Error while retrieving requested entries'); //could make more specific
        return console.error('Error executing query', err.stack);
    });

})


router.post('/:term', async (req, res) => {

  let queryString = 'INSERT INTO requested(term, fulfilled) SELECT CAST($1 AS VARCHAR),0 WHERE NOT EXISTS (SELECT 1 FROM requested WHERE term = $1);';
  let values = [req.params.term];

  (async () => {
      const client = await pool.connect();

      try {
          await client.query(queryString, values);
          res.send("added requested term: " + values[0]);
      } finally {
          client.release();
      }
  })().catch((err) => {
      res.status(500).send('Error while inserting requested term: ' + values[0]); //could make more specific
      return console.error('Error executing query', err.stack);
  });


})
