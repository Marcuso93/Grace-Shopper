const express = require('express');
const { createNewOrder, getOrderHistoryByUserId, getAllOrders } = require('../db/models/orders');
const { requireLogin, requireAdmin } = require('./utils');
const ordersRouter = express.Router();

// Get all orders (FOR ADMIN ONLY)
// GET /api/orders
ordersRouter.get('/', requireAdmin, async (req, res, next) => {
  try {
    const orders = await getAllOrders();

    res.send(orders);
  } catch ({name, message}){
    next({name, message})
  }
})

// Create/Submit new order
// POST /api/orders
// TODO: Subtract quantity from stock of item
ordersRouter.post('/', async (req, res, next) => {
  const {userId, price} = req.body;

  try {
    const newOrder = await createNewOrder({userId, price});

    res.send( newOrder ? newOrder : {
      name: 'EmptyCart',
      message: 'The cart is empty, unable to create new order.'
    });
  } catch ({name, message}) {
    next({name, message})
  }
});

// Get users order history
// GET /api/orders/user/:userId
// TODO: This will include 'inactivated' (deleted) orders... 
// we could filter them out on the front end when we don't want them
ordersRouter.get('/user/:userId', async (req, res, next) => {
  const { userId } = req.params; 
  // TODO: check if req.user.id matches userId
  if (req.user.id !== userId) {
    res.status(401).send({
      name: 'UnauthorizedUserError',
      message: `User ${req.user ? req.user.username : null} is not authorized to see this order.`
    })
  }

  try {
    const orders = await getOrderHistoryByUserId(userId);

    res.send( orders ? orders : { name: 'NoOrdersToDisplay', message: 'No order history to display.' })
  } catch ({name, message}) {
    next({name, message})
  }
});

// TODO (if we need): EDIT ORDER OR ITEM IN ORDER, REMOVE ITEM IN ORDER, DELETE ORDER? (Possibly for Admin to use?)

module.exports = ordersRouter;