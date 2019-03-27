require('mocha');
const { expect } = require('chai');
const request = require('request');


const reportedTest = () => {

    describe('Reported route', () => {

        it('should return currently reported entries with an action code of 4', (done) => {
            request('http://localhost:4000/reported' , (error, response) => {
                expect(response.statusCode).to.equal(200);
                if (response.body.length){
                    let responseJSON = JSON.parse(response.body)

                    responseJSON.forEach((entry) => {
                        expect(entry.action).to.equal(4); 
                    })
                }
                done();
            });
        });
    });
}

module.exports = reportedTest;
