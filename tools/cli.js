var colors = require('colors');

/**
 * Checks node version and prints a message before tests start
 * @param {String} nodeVersion semantic version of x.x.x style
 */
function checkNode (nodeVersion) {
  if (Number(nodeVersion.slice('.')[0]) >= 6) {
    console.log('Your node looks ES6 ready, Yay!'.rainbow);
  } else {
    console.log('These tests requrie Node version > v6.0.0'.red);
  }
}

module.exports.checkNode = checkNode(process.versions.node);
