
const addActionToRequested = db => db.query(
  `ALTER TABLE requested
   ADD COLUMN action INTEGER NOT NULL REFERENCES action(id)`
).catch(e => {
  // ignore the error when we have already run the migration successfully
  if (e.message !== 'column "action" of relation "requested" already exists') {
    throw e
  } 
})

module.exports = {
  addActionToRequested
}
