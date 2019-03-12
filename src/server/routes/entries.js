const Router = require('express-promise-router');
const router = new Router();
const pool = require('../../db');

// TODO use client singleton instead of creating one ourselves
// for now we ensure the ssl setting matches the environment
const dbConfig = require('../../db/config')(process.env.NODE_ENV || 'development');
const ssl_setting = dbConfig.ssl;
const db_url = dbConfig.connectionString;
const { Client } = require('pg');

var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

module.exports = router;

router.get('/potentials', async (req, res, next) => {
  //return entries with author id or name and identity???
  //join inner/outer for where author is null?

  //get entries with author name & id
  let queryString = 'SELECT * FROM entry INNER JOIN author ON entry.author = author.author_id WHERE action=1';

  pool.connect((err, client, release) => {
        if (err) return console.error('Error acquiring client', err.stack);
        client.query(queryString, (err, result) => {
            release();
            if (err) {
                res.status(500).send('Error while retrieving potential entries'); //could make more specific
                return console.error('Error executing query', err.stack);
            }
            console.log(result.rows);
            res.json(result.rows);
        })
    })
});



router.get('/:term', async (req, res, next) => {
//return entries with author id or name and identity???
  const client = new Client({ connectionString: db_url, ssl: ssl_setting });
  client.connect();


  //join inner/outer for where author is null?

  //get entries that match the term or synonyms
  var exactQueryString = 'SELECT * FROM entry INNER JOIN author ON entry.author = author.author_id WHERE lower(term) = $1 AND action=2';
  var synonymQueryString = 'SELECT * FROM entry INNER JOIN author ON entry.author = author.author_id WHERE lower(term) IN (SELECT lower(sort_as) FROM synonym WHERE lower(term) = $1) AND action = 2 AND lower(term) != $1'
  //var authorQueryString = 'SLECT name, identity FROM author WHERE author_id = $1'

  try {
    //get exact matches
    var res1 = await client.query(exactQueryString, [req.params.term.toLowerCase()]);
    //get synonym matches
    var res2 = await client.query(synonymQueryString, [req.params.term.toLowerCase()]);
    res.json(res1.rows.concat(res2.rows));
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error while retrieving entries'); //could make more specific
  }
  client.end();
});

//done: get timestamps submitted in proper format - read more about this
//done: update last_updated whenever u update an entry
//done: change requested query to just flip fullfilled flag
router.post('/', async (req, res) => {
  const client = new Client({ connectionString: db_url, ssl: ssl_setting });
  client.connect();

  console.log(req.body);

  const {term, definition, time_submitted, action} = req.body;
  name = req.body.name ? req.body.name : '';
  identity = req.body.identity ? req.body.identity : '';
  explanation = req.body.explanation ? req.body.explanation : '';
  var last_updated = new Date().toISOString();

  var termQueryString = 'INSERT INTO term(term) SELECT CAST($1 AS VARCHAR) WHERE NOT EXISTS (SELECT 1 FROM term WHERE term = $1);';
  var authorQueryString = 'INSERT INTO author(name, identity) SELECT CAST($1 AS VARCHAR),CAST($2 AS VARCHAR) WHERE NOT EXISTS (SELECT 1 FROM author WHERE name = $1 AND identity = $2) RETURNING author_id;';
  //var authorQueryString = 'INSERT INTO author(name, identity) SELECT CAST($1 AS VARCHAR),CAST($2 AS VARCHAR) WHERE NOT EXISTS (SELECT name, identity FROM author INTERSECT SELECT $1, $2) RETURNING author_id;';
  var authorIdQueryString = 'SELECT author_id FROM author WHERE name = $1 AND identity = $2;';
  var entryQueryString = 'INSERT INTO entry(term, definition, explanation, author, action, time_submitted, last_updated) SELECT CAST($1 AS VARCHAR),CAST($2 AS VARCHAR),CAST($3 AS VARCHAR),$4,$5,$6, $7 WHERE NOT EXISTS (SELECT 1 FROM entry WHERE term = $1 AND definition = $2 AND explanation = $3 AND author = $4);';
  //this is too general but it works:
  //change this to make it flip the fulfilled flag -- TEST THIS
  //var requestedQueryString = 'DELETE FROM requested USING entry WHERE (SELECT COUNT (entry.term) FROM entry WHERE term=requested.term AND action=2) > 1;';
  var requestedQueryString = 'UPDATE requested SET fulfilled = 1 FROM entry WHERE entry.term = requested.term AND (SELECT COUNT (entry.term) FROM entry WHERE term=requested.term AND action=2) > 1;'

  try {
    //insert term
    await client.query(termQueryString, [term]);
    //insert author & get id
    var result = await client.query(authorQueryString, [name, identity]);
    if (result.rows.length === 0) {
      result = await client.query(authorIdQueryString, [name, identity]);
    }
    const author_id = result.rows[0]["author_id"];
    //delete requested if must
    await client.query(requestedQueryString); //v general query but it works
    // //insert entry!
    await client.query(entryQueryString, [term, definition, explanation, author_id, action, time_submitted, last_updated]);
    res.send("Inserted entry for term: " + term);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error while inserting entry'); //could make more specific
  } finally {
    client.end();
  }
});


//test!! also maybe don't use both "action" and "status", pick one! probably status
router.post('/setstatus/:action/id/:id', async (req, res) => {
  const client = new Client({ connectionString: db_url, ssl: ssl_setting });
  client.connect();

  console.log(req.body);

  const { action, id } = req.params;
  var last_updated = new Date().toISOString();
  var entryQueryString = 'UPDATE entry SET action=$1, last_updated=$2 WHERE entry_id=$3'

  try {
    await client.query(entryQueryString, [action, last_updated, id]);
    res.send("Set status to " + action + " for entry with id: " + id);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error while upating entry status to: ' + action); //could make more specific
  }

  client.end();

});

// router.delete('/:id', async (req, res) => {
//   const client = new Client({ connectionString: db_url, ssl: true });
//   client.connect();

//   const { id } = req.params;
//   var getEntryQueryString = 'SELECT * FROM entry WHERE entry_id = $1;';
//   var delEntryQueryString = 'DELETE FROM entry WHERE entry_id = $1;';
//   var termQueryString = 'DELETE FROM term WHERE term = $1 AND NOT EXISTS (SELECT 1 FROM entry WHERE term = $1) ON CONFLICT ON CONSTRAINT synonym_term_fkey ;';
//   var authorQueryString = 'DELETE FROM author WHERE author_id = $1 AND NOT EXISTS (SELECT 1 FROM entry WHERE author = $1);';

//   try {
//     //get entry details
//     var result = await client.query(getEntryQueryString, [id]);

//     //delete entry
//     await client.query(delEntryQueryString, [id]);
//     //delete term if no other entries define it
//     await client.query(termQueryString, [result.rows[0]["term"]]);
//     //delete author if no other entries have it
//     await client.query(authorQueryString, [result.rows[0]["author"]]);

//     //synonyms auto delete cascading

//     res.send("Deleted entry by id: " + id);
//   } catch (err) {
//     console.error(err.stack);
//     res.status(500).send('Error while deleting entry'); //could make more specific
//   }

//   client.end();

// });



//needs work, won't return name & id of author
// router.get('/', async (req, res, next) => {
//   const client = new Client({ connectionString: db_url, ssl: true });
//   client.connect();

//   var queryString = 'SELECT * FROM entry WHERE action = 2';

//   try {
//     const { rows } = await client.query(queryString);
//     res.json(rows);
//   } catch (err) {
//     console.error(err.stack);
//     res.status(500).send('Error while retrieving entries'); //could make more specific
//   }
//   client.end();
// });
