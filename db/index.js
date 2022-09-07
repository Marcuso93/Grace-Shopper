const client = require('./client');
const models = require('./models');

module.exports = {
  ...require('./client'), // adds key/values from users.js
  // ...require('./user'), // adds key/values from users.js
};
