//this assumes that the actions table is populated
const insertEntry = (db, entryData) => {
    var {term, definition, time_submitted, action = "2", name = "", identity = "", explanation = ""} = entryData;
    var last_updated = new Date().toISOString();

    var termQueryString = 'INSERT INTO term(term) SELECT CAST($1 AS VARCHAR) WHERE NOT EXISTS (SELECT 1 FROM term WHERE term = $1);';
    var authorQueryString = 'INSERT INTO author(name, identity) SELECT CAST($1 AS VARCHAR),CAST($2 AS VARCHAR) WHERE NOT EXISTS (SELECT 1 FROM author WHERE name = $1 AND identity = $2) RETURNING author_id;';
    var authorIdQueryString = 'SELECT author_id FROM author WHERE name = $1 AND identity = $2;';
    var entryQueryString = 'INSERT INTO entry(term, definition, explanation, author, action, time_submitted, last_updated) SELECT CAST($1 AS VARCHAR),CAST($2 AS VARCHAR),CAST($3 AS VARCHAR),$4,$5,$6, $7 WHERE NOT EXISTS (SELECT 1 FROM entry WHERE term = $1 AND definition = $2 AND explanation = $3 AND author = $4);';

    return db.query(termQueryString, [term])
        .then(() => {
            return db.query(authorQueryString, [name, identity])
        })
        .then((result) => {
            if (result.rows.length === 0) {
                return db.query(authorIdQueryString, [name, identity]);
            }
            return result;
        })
        .then((authorResult) => {
                const author_id = authorResult.rows[0]["author_id"];
                return db.query(entryQueryString, [term, definition, explanation, author_id, action, time_submitted, last_updated]);
            }
        ).then(() => {
            console.log("done inserting entry by", entryData.term, entryData.name, entryData.identity)
            }
        ).catch((err) => {
            console.error(err.stack);
        })
}

const seedEntries = (db, data) => {
    return data.reduce((promiseChain, currentEntry) => {
        return promiseChain.then(chainResults =>
            insertEntry(db, currentEntry).then(currentResult =>
                [ ...chainResults, currentResult ]
            )
        );
    }, Promise.resolve([]));
}

module.exports = {
    seedEntries: seedEntries,
    insertEntry: insertEntry
}
