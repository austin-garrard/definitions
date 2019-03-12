
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

const get = (path, config = {}) =>
  getPm(uri(path))
    .then(transform(config));

const post = (path, config = {}) =>
  postPm({
    url: uri(path),
    body: config.body,
    json: true
  })
  .then(transform(config))

const requestNewTerm = term => post(`/requested/${term}`);

module.exports = {
  get,
  post,
  requestNewTerm
}

