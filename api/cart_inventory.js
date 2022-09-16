const express = require('express');
const { addItemToCart, updateCartInventory, removeItemFromCart } = require('../db');
const { requireLogin } = require('./utils');

const cartInventoryRouter = express.Router();

// TODO: in usersRouter we could create a way to get all of the users items in cart

// POST /api/cart_inventory
// Create cart_inventory, ie add item to cart
// TODO: check user if we switch from cartsId to userId
cartInventoryRouter.post('/', requireLogin, async (req, res, next) => {
  const { cartsId, inventoryId, quantity, price } = req.body;

  try {
    const cart_item = await addItemToCart({ cartsId, inventoryId, quantity, price });

    res.send(cart_item);
  } catch ({name, message}) {
    next({name, message})
  }
});

// PATCH /api/cart_inventory/:cartInventoryId
// Update an item type in cart (probably just count?)
cartInventoryRouter.patch('/:cartInventoryId', requireLogin, async(req, res, next) => {
  const { cartInventoryId } = req.params;
  const { ...fields } = req.body;

  try {
    const cart_item = await updateCartInventory({ id: cartInventoryId, ...fields });

    res.send(cart_item);
  } catch ({name, message}){
    next({name, message})
  }
});

// DELETE /api/cart_inventory/:cartInventoryId
// Remove an item from the cart
cartInventoryRouter.delete('/:cartInventoryId', requireLogin, async(req, res, next) => {
  const { cartInventoryId } = req.params;

  try {
    const removedCartItem = await removeItemFromCart(cartInventoryId);
    
    res.send(removedCartItem);
  } catch ({name, message}) {
    next({name, message})
  }
});

module.exports = cartInventoryRouter;