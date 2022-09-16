const client = require("../client")

async function getCartItemById(id) {
  try {
    const { rows: [cart_item] } = await client.query(`
      SELECT *
      FROM cart_inventory
      WHERE id = $1
    `, [id]);

    return cart_item
  } catch (error) {
    throw error
  }
}

async function addItemToCart({ cartsId, inventoryId, quantity, price }) {
  try {
    const { rows: [cart_item] } = await client.query(`
      INSERT INTO cart_inventory("cartsId", "inventoryId", quantity, price)
      VALUES ($1, $2, $3, $4)
      RETURNING*
    `, [cartsId, inventoryId, quantity, price]);

    return cart_item
  } catch (error) {
    throw error
  }
}

// TODO: OR MAYBE WE JUST DO THIS BY USER ID????? ELIMINATE CARTS TABLE ALTOGETHER???
// Will return all inventory in cart
async function getCartInventoryByUserCart({cartId}) {
  try {
    const { rows: cart_inventory } = await client.query(`
      SELECT*
      FROM cart_inventory
      WHERE "cartId"=$1
    `, [cartId]);

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
        WHERE id=${id}
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
      WHERE id=$1
      RETURNING*
    `, [id]);

    return deletedCartItem
  } catch (error) {
    throw error
  }
}

// TODO: I don't think we'll need this... the cart_inventory will be associated with user already
// No one else should have access to the users "cart"

// async function canEditCartInventory(){

// }

// TODO: remove all items from cart

module.exports = {
  getCartItemById,
  addItemToCart,
  getCartInventoryByUserCart,
  updateCartItem,
  removeItemFromCart
};