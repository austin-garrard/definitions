const Router = require('express-promise-router');
const router = new Router();

// const db_url = process.env.DATABASE_URL;
// const { Client } = require('pg');

// var bodyParser = require('body-parser');
// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({extended: true}));

module.exports = router;

// router.get('/', async (req, res, next) => {
//   const client = new Client({ connectionString: db_url, ssl: true });
//   client.connect();

//   //var queryString = 'SELECT * FROM potential';
//   var queryString = 'SELECT * FROM entry WHERE action = 1';


//   try {
//     const { rows } = await client.query(queryString);
//     res.json(rows);
//   } catch (err) {
//     console.error(err.stack);
//     res.status(500).send('Error while retrieving potential entries'); //could make more specific
//   }

//   client.end();

// });


// router.post('/', async (req, res) => {
//   const client = new Client({ connectionString: db_url, ssl: true });
//   client.connect();

//   console.log(req.body);

//   const {term, definition} = req.body;
//   name = req.body.name ? req.body.name : '';
//   identity = req.body.identity ? req.body.identity : '';
//   explanation = req.body.explanation ? req.body.explanation : '';

//   var termQueryString = 'INSERT INTO term(term) SELECT CAST($1 AS VARCHAR) WHERE NOT EXISTS (SELECT 1 FROM term WHERE term = $1);';
//   var authorQueryString = 'INSERT INTO author(name, identity) SELECT CAST($1 AS VARCHAR),CAST($2 AS VARCHAR) WHERE NOT EXISTS (SELECT 1 FROM author WHERE name = $1 AND identity = $2) RETURNING author_id;';
//   //var authorQueryString = 'INSERT INTO author(name, identity) SELECT CAST($1 AS VARCHAR),CAST($2 AS VARCHAR) WHERE NOT EXISTS (SELECT name, identity FROM author INTERSECT SELECT $1, $2) RETURNING author_id;';
//   var authorIdQueryString = 'SELECT author_id FROM author WHERE name = $1 AND identity = $2;';
//   var entryQueryString = 'INSERT INTO entry(term, definition, explanation, author, action) SELECT CAST($1 AS VARCHAR),CAST($2 AS VARCHAR),CAST($3 AS VARCHAR),$4,1 WHERE NOT EXISTS (SELECT 1 FROM entry WHERE term = $1 AND definition = $2 AND explanation = $3 AND author = $4);';

//   try {
//     //insert term
//     await client.query(termQueryString, [term]);
//     //insert author & get id
//     var result = await client.query(authorQueryString, [name, identity]);
//     if (result.rows.length === 0) {
//       result = await client.query(authorIdQueryString, [name, identity]);
//     }
//     const author_id = result.rows[0]["author_id"];
//     // //insert entry!
//     await client.query(entryQueryString, [term, definition, explanation, author_id]);
//     res.send("Inserted potential entry for term: " + term);
//   } catch (err) {
//     console.error(err.stack);
//     res.status(500).send('Error while inserting potential entry'); //could make more specific
//   }

//   client.end();

// });


// router.delete('/:id', async (req, res) => {
//   const client = new Client({ connectionString: db_url, ssl: true });
//   client.connect();

//   const { id } = req.params;
//   var queryString = 'DELETE FROM potential WHERE potential_id = $1;';

//   try {
//     await client.query(queryString, [id]);
//     res.send("Deleted potential entry by id: " + id);
//   } catch (err) {
//     console.error(err.stack);
//     res.status(500).send('Error while deleting potential entry'); //could make more specific
//   }

//   client.end();

// });

// router.post('/accept/:id', async (req, res) => {
//   const client = new Client({ connectionString: db_url, ssl: true });
//   client.connect();

//   const { id} = req.params;

//   var authorIdQueryString = 'SELECT author_id FROM author WHERE name = $1 AND identity = $2;';
//   var entryQueryString = 'UPDATE entry SET action=2 WHERE entry_id = $1'

//   try {
//     // //update entry action
//     await client.query(entryQueryString,[id]);
//     res.send("Accepted potential entry with id: " + id);
//   } catch (err) {
//     console.error(err.stack);
//     res.status(500).send('Error while accepting potential entry'); //could make more specific
//   }

//   client.end();

// });

// router.post('/reject/:id', async (req, res) => {
//   const client = new Client({ connectionString: db_url, ssl: true });
//   client.connect();

//   console.log(req.body);

//   const { id } = req.params;
//   var entryQueryString = 'UPDATE entry SET action=3 WHERE entry_id=$1'

//   try {
//     await client.query(entryQueryString, [id]);
//     res.send("Rejected potential entry with id: " + id);
//   } catch (err) {
//     console.error(err.stack);
//     res.status(500).send('Error while rejecting potential entry'); //could make more specific
//   }

//   client.end();

// });

// router.post('/', async (req, res) => {
//   const client = new Client({ connectionString: db_url, ssl: true });
//   client.connect();

//   const {term, definition} = req.body;
//   name = req.body.name ? req.body.name : '';
//   identity = req.body.identity ? req.body.identity : '';
//   explanation = req.body.explanation ? req.body.explanation : '';


//   //var queryString = 'INSERT INTO potential(term, definition, explanation, name, identity) SELECT CAST($1 AS VARCHAR),CAST($2 AS VARCHAR),CAST($3 AS VARCHAR),CAST($4 AS VARCHAR),CAST($5 AS VARCHAR) WHERE NOT EXISTS (SELECT 1 FROM potential WHERE term = $1 AND definition = $2 AND explanation = $3 AND name = $4 AND identity = $5);';

//   try {
//     await client.query(queryString, [term, definition, explanation, name, identity]);
//     res.send("Inserted potential entry for term: " + term);
//   } catch (err) {
//     console.error(err.stack);
//     res.status(500).send('Error while inserting potential entry'); //could make more specific
//   }

//   client.end();

// });
