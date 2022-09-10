const client = require("../client")

// What id is this? will we need it?
async function getCartInventoryById(id) {
  try {
    const { rows: [cart_inventory] } = await client.query(`
      SELECT *
      FROM cart_inventory
      WHERE id = $1
    `, [id])

    return cart_inventory
  } catch (error) {
    throw error
  }
}

async function removeAllItemsFromCartInventory(cartId) {
  try {
    const { rows: [deletedCart_inventory] } = await client.query(`
      DELETE
      FROM cart_inventory
      WHERE id=$1
      RETURNING*
    `, [cartId]);

    return deletedCart_inventory;

  } catch (error) {
    throw error;
  }
}

async function addToCartinventory({ userId, inventoryId, quantity, price, isPurchased }) {
  try {
    const { rows: [cart_inventory] } = await client.query(`
      INSERT INTO cart_inventory("userId", "inventoryId", quantity, price, "isPurchased")
      VALUES($1, $2, $3, $4, $5)
      RETURNING *;
    `, [userId, inventoryId, quantity, price, isPurchased]);

    return cart_inventory;

  } catch (error) {
    throw error
  }
}

async function updateCartInventory({ inventoryId, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}" =$${index + 1}`
  ).join(', ');

  if (setString.length === 0) return;

  try {
    const { rows: [updatedCartInventory] } = await client.query(`
      UPDATE cart_inventory
      SET ${setString}
        WHERE id=${inventoryId}
      RETURNING *;
    `, Object.values(fields));

    return updatedCartInventory;

  } catch (error) {
    throw error;
  }
}

module.export = {
  getCartInventoryById,
  addToCartinventory,
  removeAllItemsFromCartInventory,
  updateCartInventory
};