
const request = require('request');
const promisify = require('util').promisify;

const getPm = promisify(request.get);
const postPm = promisify(request.post);

// TODO host:port from config
const uri = path => `http://localhost:4000${path}`;
const transform = (config) => response => {
  if (config.json) {
    response.body = JSON.parse(response.body);
  }

  return response;
}

const verb = f => (path, config = {}) => f(uri(path)).then(transform(config));
const get = verb(getPm);
const post = verb(postPm);

const requestNewTerm = term => post(`/requested/${term}`);

module.exports = {
  get,
  post,
  requestNewTerm
}

