const express = require('express');
const usersRouter = express.Router();
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env
const { requireLogin, requireAdmin } = require('./utils');
const {
  createUser,
  getUser,
  // getUserById,
  getReviewsByUserId,
  getUserByUsername,
  getAllUsers,
  getCartInventoryByUserId
} = require('../db');

//api calls below
usersRouter.get('/', async (req, res, next) => {
  try {
    const AllUsers = await getAllUsers();

    res.send(AllUsers)
  } catch (error) {
    throw error;
  }
})

usersRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password"
    })
  }

  try {
    const user = await getUser({username, password});

    if (user) {
      const token = jwt.sign({
        id: user.id,
        username: user.username
      }, JWT_SECRET);

      res.send({ user, token, message: "you're logged in!" })
    } else {
      next({
        name: 'IncorrectCredentialsError',
        message: 'Username or password is incorrect.',
      })
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

usersRouter.post('/register', async (req, res, next) => {

  try {
    const { username, password, address, fullname, email } = req.body
    const _user = await getUserByUsername(username)

    if (_user) {
      res.send({
        name: 'UserExistsError',
        message: `User ${username} is already taken.`,
        error: 'Error'
      })
    }

    if (password.length < 8) {
      res.send({
        error: 'Error',
        message: 'Password Too Short!',
        name: 'Password Error'
      })
    }

    const user = await createUser({ username, password, address, fullname, email })

    const token = jwt.sign({
      id: user.id,
      username: user.username
    }, JWT_SECRET);

    res.send({
      message: "thank you for signing up",
      token,
      user,

    })
  } catch ({ error, name, message }) {
    next({ error, name, message })
  }
});

// get my reviews
usersRouter.get('/:userId/reviews', async (req, res, next) => {
  const { userId } = req.params;

  try {
    const userReviews = await getReviewsByUserId(userId);

    res.send(userReviews);
  } catch ({ name, message }) {
    next({ name, message })
  }
})

// get my cart
usersRouter.get('/:userId/cart', async (req, res, next) => {
  const { userId } = req.params;

  try {
    const cart = await getCartInventoryByUserId({userId});

    res.send(cart);
  } catch ({ name, message }) {
    next({ name, message })
  }
})

module.exports = usersRouter;