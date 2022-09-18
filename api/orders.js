const express = require('express');
const { createNewOrder, getOrderHistoryByUserId } = require('../db/models/orders');
const { requireLogin } = require('./utils');
const ordersRouter = express.Router();

// create new order
// POST /api/orders
// TODO: check if correct user?
// TODO: requireLogin
ordersRouter.post('/', async (req, res, next) => {
  const {userId, price} = req.body;

  try {
    const newOrder = await createNewOrder({userId, price});

    res.send(newOrder);
  } catch ({name, message}) {
    next({name, message})
  }
});

// get users order history
// GET /api/orders/user/:userId
// TODO: requireLogin
ordersRouter.get('/user/:userId', async (req, res, next) => {
  const { userId } = req.params; 
  // TODO: check if req.user.id matches userId
  try {
    const orders = await getOrderHistoryByUserId(userId);

    res.send(orders);
  } catch ({name, message}) {
    next({name, message})
  }
});

// TODO: EDIT ORDER?

module.exports = ordersRouter;