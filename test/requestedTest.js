require('mocha');
const { expect } = require('chai');
const request = require('request');
const { post, get, requestNewTerm } = require('./requestHelper.js');
const db = require('../src/db')
const { unwrap } = require('../src/db/util')

const requestedTest = () => {
  describe('Requested route', () => {
    describe('POST /requested', () => {
      describe('creating a term', () => {
        it('responds with success', async () => {
	        const {statusCode, body} = await post('/requested/test124');
	        
	        expect(statusCode).to.equal(200);
	        expect(body).to.equal('added requested term: test124');
	      });

        it('should create a potential, unfulfilled requested term', async () => {
	        const {statusCode, body} = await post('/requested/test124');
	        
          const { rows } = await db.query('SELECT * FROM requested')
          expect(rows.length).to.equal(1)
          expect(rows[0]).to.eql({
            term: 'test124',
            action: 1,
            fulfilled: 0
          })
	      });
      })

      describe('updating a term', () => {
        beforeEach(async () => {
          const { statusCode } = await post('/requested/test124');
          expect(statusCode).to.equal(200)
        })

        describe('when no action query param is provided', () => {
          it('responds with failure', async () => {
            const { statusCode, body } = await post('/requested/test124', { json: true })
          
            expect(body).to.eql({
              message: 'Invalid parameters'
            })
            expect(statusCode).to.equal(400)
          })

          it('does not add a term', async () => {
            const initial = await unwrap(db, 'SELECT * FROM requested')
            expect(initial.length).to.equal(1)

            const { statusCode, body } = await post('/requested/test124')
            
            const final = await unwrap(db, 'SELECT * FROM requested')
            expect(final.length).to.equal(1)
          })

          it('does not change the existing term', async () => {
            const [ initialTerm ] = await unwrap(db, 'SELECT * FROM requested')
            
            const { statusCode, body } = await post('/requested/test124')
            
            const [ finalTerm ] = await unwrap(db, 'SELECT * FROM requested')
            expect(finalTerm).to.eql(initialTerm)
          })
        })

        describe('when the action is "accepted"', () => {
          it('responds with success', async () => {
            const { statusCode, body } = await post('/requested/test124?action=accepted', { json: true })

            expect(body).to.eql({
              message: 'Accepted term "test124"'
            })
            expect(statusCode).to.eql(200)
          })
        
          it('sets the action to accepted', async () => {
            const { statusCode, body } = await post('/requested/test124?action=accepted', { json: true })

            const [ term ] = await unwrap(db, 'SELECT * FROM requested')
            expect(term.action).to.equal(2)
          })
        })

        describe('when the action is "rejected"', () => {
          it('responds with success', async () => {
            const { statusCode, body } = await post('/requested/test124?action=rejected', { json: true })

            expect(body).to.eql({
              message: 'Rejected term "test124" :('
            })
            expect(statusCode).to.eql(200)
          })
        
          it('sets the action to rejected', async () => {
            const { statusCode, body } = await post('/requested/test124?action=rejected', { json: true })

            const [ term ] = await unwrap(db, 'SELECT * FROM requested')
            expect(term.action).to.equal(4)
          })
        })
      })
    })

    describe('GET /requested', () => {
      beforeEach(async () => {
        await post('/requested/test124')
        await post('/requested/test125')
        await post('/requested/test125?action=accepted')
      })

      it('responds with all the potential requested terms by default', async () => {
	      const {statusCode, body} = await get('/requested', { json: true });
        expect(body).to.eql([{
          term: 'test124',
          fulfilled: 0,
          action: 1
        }]);
        expect(statusCode).to.equal(200);
      });

      it('responds with all the requested terms with a status of accepted', async () => {
	      const {statusCode, body} = await get('/requested?action=accepted', { json: true });
        expect(body).to.eql([{
          term: 'test125',
          fulfilled: 0,
          action: 2
        }]);
        expect(statusCode).to.equal(200);
      })
    })
  });
}

module.exports = requestedTest;
