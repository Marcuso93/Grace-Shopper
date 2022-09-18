const client = require("../client")

async function getCartItemById(id) {
  try {
    const { rows: [cart_item] } = await client.query(`
      SELECT *
      FROM cart_inventory
        WHERE id = $1 AND "isPurchased"=false
    `, [id]);

    return cart_item
  } catch (error) {
    throw error
  }
}

async function addItemToCart({ userId, inventoryId, quantity, price, isPurchased=false }) {
  try {
    const { rows: [cart_item] } = await client.query(`
      INSERT INTO cart_inventory("userId", "inventoryId", quantity, price, "isPurchased")
      VALUES ($1, $2, $3, $4, $5)
      RETURNING*
    `, [userId, inventoryId, quantity, price, isPurchased]);

    return cart_item
  } catch (error) {
    throw error
  }
}

// Will return all inventory in cart
async function getCartInventoryByUserId({userId}) {
  try {
    const { rows: cart_inventory } = await client.query(`
      SELECT*
      FROM cart_inventory
        WHERE "userId"=$1 AND "isPurchased"=false
    `, [userId]);

    return cart_inventory

  } catch(error) {
    throw error
  }
}

// The fields will be "cartsId", "inventoryId", quantity, price (probably not cartsId though-- they won't switch to someone elses cart).
// The id here is the cart_inventory id... i.e. one type of item in cart
async function updateCartItem({ id, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}" =$${index + 1}`
  ).join(', ');

  if (setString.length === 0) return;

  try {
    const { rows: [updatedCartItem] } = await client.query(`
      UPDATE cart_inventory
      SET ${setString}
        WHERE id=${id} AND "isPurchased"=false
      RETURNING *;
    `, Object.values(fields));

    return updatedCartItem;

  } catch (error) {
    throw error;
  }
}

// Will remove one type of inventory from "cart" using cart_inventory ID
async function removeItemFromCart(id) {
  try {
    const { rows: [deletedCartItem] } = await client.query(`
      DELETE
      FROM cart_inventory
        WHERE id=$1 AND "isPurchased"=false
      RETURNING*
    `, [id]);

    return deletedCartItem
  } catch (error) {
    throw error
  }
}

async function canEditCartInventory({cartInventoryId, userId}){
  try {
    const { rows: [cartItem] } = await client.query(`
      SELECT*
      FROM cart_inventory
          WHERE id=$1
      `, [cartInventoryId])

    if (cartItem.userId === userId) { return true }

    return false

  } catch (error) {
    throw error
  }
}

async function removeAllItemsFromCart(userId) {
  try {
    const { rows: deletedCartItems } = await client.query(`
      DELETE
      FROM cart_inventory
        WHERE "userId"=$1 AND "isPurchased"=false
      RETURNING*
    `, [userId]);

    return deletedCartItems
  } catch (error) {
    throw error
  }
}

module.exports = {
  getCartItemById,
  addItemToCart,
  getCartInventoryByUserId,
  updateCartItem,
  removeItemFromCart,
  canEditCartInventory,
  removeAllItemsFromCart
};