const express = require('express');
const { addItemToCart, updateCartItem, removeItemFromCart } = require('../db');
const { requireLogin } = require('./utils');

const cartInventoryRouter = express.Router();

// POST /api/cart_inventory
// Create cart_inventory, ie add item to cart
// TODO: check user is correct user?
cartInventoryRouter.post('/',requireLogin, async (req, res, next) => {
  const { userId, inventoryId, quantity, price } = req.body;

  try {
    const cart_item = await addItemToCart({ userId, inventoryId, quantity, price });

    res.send(cart_item);
  } catch ({name, message}) {
    next({name, message})
  }
});

// PATCH /api/cart_inventory/:cartInventoryId
// Update an item type in cart (TODO: probably just quantity and isPurchased???)
// TODO: Check user is correct user?
cartInventoryRouter.patch('/:cartInventoryId', requireLogin, async(req, res, next) => {
  const { cartInventoryId } = req.params;
  const { ...fields } = req.body;

  try {
    const cart_item = await updateCartItem({ id: cartInventoryId, ...fields });

    res.send(cart_item);
  } catch ({name, message}){
    next({name, message})
  }
});

// DELETE /api/cart_inventory/:cartInventoryId
// Remove an item from the cart
// TODO: check user is correct user?
cartInventoryRouter.delete('/:cartInventoryId', requireLogin, async(req, res, next) => {
  const { cartInventoryId } = req.params;

  try {
    const removedCartItem = await removeItemFromCart(cartInventoryId);
    
    res.send(removedCartItem);
  } catch ({name, message}) {
    next({name, message})
  }
});

// TODO: what do we co when order is submitted????

module.exports = cartInventoryRouter;