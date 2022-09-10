const express = require('express');
const usersRouter = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env
const { requireLogin, requireAdmin } = require('./utils');
const {
  createUser,
  // getUser,
  // getUserById,
  getUserByUsername,
  // getAllUsers
} = require('../db');

//api calls below
usersRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await getUserByUsername(username)
    const hashedPassword = user.password;
    const matched = await bcrypt.compare(password, hashedPassword);

    if (!username || !password) {
      next({
        name: "MissingCredentialsError",
        message: "Please supply both a username and password"
      })
    }

    if (user && matched) {
      const token = jwt.sign({
        id: user.id,
        username: user.username
      }, JWT_SECRET);

      res.send({ user, token, message: "you're logged in!" })
    } else {
      next({
        name: 'IncorrectCredentialsError',
        message: 'Username or password is incorrect',
      }
      )
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

usersRouter.post('/register', async (req, res, next) => {

  try {
    const { username, password } = req.body
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

    const user = await createUser({ username, password })

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

usersRouter.get('/me', requireLogin, async (req, res, next) => {
  try {
    res.send(req.user)
    next()
  } catch ({ name, message }) {
    next({ name, message });
  }
});

//get my reviews
usersRouter.get('/:userId/reviews', async (req, res, next) => {
  const { userId } = req.params;

  try {
    const userReviews = await getReviewsByUserId(userId);

    res.send(userReviews);
  } catch ({ name, message }) {
    next({ name, message })
  }
})



module.exports = usersRouter;