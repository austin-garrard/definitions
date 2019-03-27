const Router = require('express-promise-router');
const router = new Router();
const pool = require('../../db');

function decodeUrl(str) {
  str = str.replace(/%28/g, "(");
  str = str.replace(/%29/g, ")");
  return decodeURIComponent(str);
}

module.exports = router;

router.post('/:term/:synonym', async (req, res, next) => {

  let term = decodeUrl(req.params.term);
  let synonym = decodeUrl(req.params.synonym);

  let queryString = 'INSERT INTO synonym(term, sort_as) VALUES ($1,$2) ON CONFLICT ON CONSTRAINT synonym_pkey DO NOTHING;';
  let values = [term, synonym];

  console.log("term: " + term + " synonym: " + synonym);

  pool.connect((err, client, release) => {
      if (err) return console.error('Error acquiring client', err.stack);
        client.query(queryString, values, (err, result) => {
            release();
            if (err) {
                res.status(500).send('Error while inserting synonym: ' + term + "\/" + synonym); //could make more specific
                return console.error('Error executing query', err.stack);
            }
            console.log(result.rows);
            res.send("added synonym: " + term + "\/" + synonym);
        })
    })
});

//
// router.get('/:term', async (req, res) => {
//   const client = new Client({ connectionString: db_url, ssl: true });
//   client.connect();
//
//     var queryString = 'SELECT * FROM synonym WHERE term = $1';
// });
