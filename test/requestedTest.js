const { expect } = require('chai');
const request = require('request');
const { post, get, requestNewTerm } = require('./requestHelper.js');

describe('Requested route', () => {

  it('POST: should request an entry', async () => {
	  const {statusCode, body} = await post('/requested/test124');
	  
	  expect(statusCode).to.equal(200);
	  expect(body).to.equal('added requested term: test124');
	});

  it('GET: should return requested entries', async () => {
	  await requestNewTerm('test124');
	  await requestNewTerm('beep boop');

	  const {statusCode, body} = await get('/requested', { json: true });

    expect(statusCode).to.equal(200);
    expect(body).to.eql(['test124', 'beep boop']);
  });
});
