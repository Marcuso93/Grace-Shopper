// grab our db client connection to use with our adapters
/* eslint-disable no-useless-catch */
const client = require('../client');
const bcrypt = require('bcrypt');

async function createUser({ username, password, address, fullname, email, isAdmin = false }) {
  try {
    const SALT_COUNT = 10;
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

    const { rows: [user] } = await client.query(`
      INSERT INTO users(username, password, address, fullname, email, "isAdmin")
      VALUES($1, $2, $3, $4, $5, $6)
      ON CONFLICT (username) DO NOTHING
      RETURNING *;
      `, [username, hashedPassword, address, fullname, email, isAdmin]
    );

    delete user.password
    return user
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  try {
    const user = await getUserByUsername(username);
    const hashedPassword = user.password;

    const isValid = await bcrypt.compare(password, hashedPassword)

    if (isValid) {
      delete user.password
      return user
    } else {
      return null
    }
  } catch (error) {
    throw error
  }
}

async function getUserById(userId) {
  try {
    const { rows: [user] } = await client.query(`
      SELECT *
      FROM users
      WHERE id = $1
    `, [userId])

    delete user.password

    return user
  } catch (error) {
    throw error
  }
}

async function getUserByUsername(username) {
  try {
    const { rows: [user] } = await client.query(`
    SELECT  *
    FROM users
    WHERE username = $1
    `, [username])

    return user
  } catch (error) {
    throw error
  }
}

async function getAllUsers() {
  try {
    const { rows } = await client.query(`
      SELECT*
      FROM users;
    `);

    return rows;
  } catch (error) {
    throw error;
  }
}


module.exports = {
  // add your database adapter fns here
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
  getAllUsers,
};
