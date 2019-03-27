const Router = require('express-promise-router');
const router = new Router();
const pool = require('../../db')

module.exports = router;

router.get('/', async (req, res, next) => {

  //var queryString = 'SELECT * FROM potential';
  let queryString = 'SELECT * FROM entry WHERE action = $1';
  let values = [4];

    (async () => {
        const client = await pool.connect();

        try {
            const result = await client.query(queryString, values);
            res.json(result.rows);
        } finally {
            client.release();
        }
    })().catch((err) => {
        res.status(500).send('Error while retrieving reported entries'); //could make more specific
        return console.error('Error executing query', err.stack);
    });

});
