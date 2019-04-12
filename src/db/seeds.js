const { executeInSequence } = require('./util')

const insertAction = (id, title) =>({
  text: `INSERT INTO action(id,title) VALUES($1,$2)`, 
  values: [id, title]
})

const seedActions = db => db.query('SELECT COUNT(*) FROM action')
  .then(result => result.rows[0].count === '4'
    ? Promise.resolve()
    : executeInSequence(db, [
        insertAction(1, 'potential'),
        insertAction(2, 'accepted'),
        insertAction(3, 'reported'),
        insertAction(4, 'rejected')
    ])
  )

module.exports = {
  seedActions
}
