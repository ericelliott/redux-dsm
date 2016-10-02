var colors = require('colors');

/**
 * Checks node version and prints a message before tests start
 * Latest Nodejs or at least 6.x.x is required to run our ES6 tests
 * @param {String} nodeVersion node semantic version
 */
function checkNode (nodeVersion) {
  if (Number(nodeVersion.slice('.')[0]) >= 6) {
    console.log('Your node looks ES6 ready, Yay!'.rainbow);
  } else {
    console.log('These tests requrie Node version > v6.0.0'.red);
  }
}

module.exports = checkNode(process.versions.node);
