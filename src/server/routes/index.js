const terms = require('./terms');
const entries = require('./entries');
const synonyms = require('./synonyms');
const requested = require('./requested');
const potentials = require('./potentials');
const authors = require('./authors');
const reported = require('./reported');


module.exports = (app) => {
  app.use('/terms', terms)
  app.use('/entries', entries)
  app.use('/synonyms', synonyms)
  app.use('/requested', requested)
  app.use('/potentials', potentials)
  app.use('/authors', authors)
  app.use('/reported', reported)
}