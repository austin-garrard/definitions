require('mocha');
const { expect } = require('chai');
const { get } = require('./requestHelper');

const authorTest = () => {

    describe('Authors route', () => {

        it('should return no authors for an author that does not exist yet', async () => {
            const {statusCode, body} = await get('/authors/93294673');
            
	    expect(statusCode).to.equal(200);
            expect(body).to.equal('[]');
        });

        it('should return no authors for an invalid author id', async () => {
            const {statusCode, body} = await get('/authors/m4');

            expect(statusCode).to.equal(500);
            expect(body).to.equal('Invalid author id');
        });

        it('should return one author for a valid author id', async () => {
	    // TODO
	    const pool = require('../src/db');
	    await pool.query(`INSERT INTO author(name, identity)\
			      VALUES('Agender Al', 'ace')`);

	    const {statusCode, body} = await get('/authors/1', { json: true });

            expect(statusCode).to.equal(200);
            expect(body).to.eql([{"name":"Agender Al","identity":"ace"}]);
        });

    });

}

module.exports = authorTest;
