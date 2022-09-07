// grab our db client connection to use with our adapters
const client = require('../client');
const bcrypt = require('bcrypt')

async function createUser({ username, password}) {
  try {

  }
}
async function getAllUsers() {
  /* this adapter should fetch a list of users from your db */
}

module.exports = {
  // add your database adapter fns here
  getAllUsers,
};
