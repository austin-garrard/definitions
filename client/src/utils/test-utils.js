const domTestingLib = require('dom-testing-library')
const { queries, queryHelpers } = domTestingLib

function getAllByText(container, text, ...rest) {
    const els = queries.queryAllByText(container, text, ...rest);
  
    if (!els.length) {
        throw (0, new Error(`Unable to find the element`));
    }
  
    return els;
  }

  export function getByText(...args) {
    return queryHelpers.firstResultOrNull(getAllByText, ...args)
  }

  module.exports = {
    getByText,
  }
