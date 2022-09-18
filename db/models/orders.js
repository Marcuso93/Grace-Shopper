/* eslint-disable no-useless-catch */
const client = require("../client")

async function getAllOrders(){
  try {
    const { rows: orders } = await client.query(`
      SELECT*
      FROM orders
    `);

    const ordersWithItemsAttached = await attachCartItemsToOrders(orders);

    return ordersWithItemsAttached
  } catch (error) {
    throw error
  }
}

async function createNewOrder({userId, price}){
  try {
    const { rows: [order] } = await client.query(`
      INSERT INTO orders("userId", price)
      VALUES($1, $2)
      RETURNING*
    `, [userId, price]);

    await addCartToOrder({orderId: order.id, userId});

    const orderWithCartItemsAttached = await attachCartItemsToOrders([order]);

    return orderWithCartItemsAttached[0]
  } catch (error) {
    throw error
  }
}

async function addCartToOrder({orderId, userId}){
  try {
    const { rows: cartItemsToOrder } = await client.query(`
        UPDATE cart_inventory
        SET "orderId"=$1, "isPurchased"=true
          WHERE "userId"=$2 AND "isPurchased"=false
        RETURNING*
      `, [orderId, userId]);
  
      return cartItemsToOrder;
  } catch (error) {
    throw error
  }
}

async function attachCartItemsToOrders(orders) {
  const ordersToReturn = [...orders];
  const includedOrderIds = orders.map((_, index) => `$${index + 1}`).join(', ');
  const orderIds = orders.map(order => order.id);
  if (!orderIds?.length) return;
  
  try {
    const { rows: cartItems } = await client.query(`
      SELECT inventory.id AS "inventoryId", inventory.name, 
        inventory.description, cart_inventory.quantity, cart_inventory.price, 
        cart_inventory.id AS "cartInventoryId", cart_inventory."orderId"
      FROM inventory
      JOIN cart_inventory ON cart_inventory."inventoryId" = inventory.id
      WHERE cart_inventory."orderId" IN (${includedOrderIds});
    `, orderIds);

    for (const order of ordersToReturn) {
      const itemsToAdd = cartItems.filter(item => item.orderId === order.id);
      order.items = itemsToAdd;
    }

    return ordersToReturn;
  } catch (error) {
    throw error
  }
}

async function getOrderHistoryByUserId(userId) {
  try {
    const { rows: orders } = await client.query(`
      SELECT * 
      FROM orders
      WHERE "userId"=$1;
    `, [userId]);
    
    const ordersWithItemsAttached = await attachCartItemsToOrders(orders);

    return ordersWithItemsAttached;
  } catch (error) {
    throw error
  }
}

// TODO: update order and/or items in order... (maybe something only admin could do?)
async function updateSubmittedOrder({ orderId, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}" =$${index + 1}`
  ).join(', ');

  if (setString.length === 0) return;

  try {
    const { rows: [updatedOrder] } = await client.query(`
      UPDATE orders
      SET ${setString}
        WHERE id=${orderId}
      RETURNING *;
    `, Object.values(fields));

    return updatedOrder;

  } catch (error) {
    throw error;
  }
}

async function updateSingleItemInSubmittedOrder({ orderId, cart_inventoryId, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}" =$${index + 1}`
  ).join(', ');

  if (setString.length === 0) return;

  try {
    const { rows: [updatedItemInOrder] } = await client.query(`
      UPDATE cart_inventory
      SET ${setString}
        WHERE id=${cart_inventoryId} AND "isPurchased"=true AND "orderId"=${orderId}
      RETURNING *;
    `, Object.values(fields));

    return updatedItemInOrder;

  } catch (error) {
    throw error;
  }
}

async function removeSingleItemFromSubmittedOrder({cart_inventoryId, orderId}) {
  try {
    const { rows: [deletedItemFromOrder] } = await client.query(`
      DELETE
      FROM cart_inventory
        WHERE id=$1 AND "isPurchased"=true AND "orderId"=$2
      RETURNING*
    `, [cart_inventoryId, orderId]);

    return deletedItemFromOrder
  } catch (error) {
    throw error
  }
}

async function deleteOrder(){

}

module.exports = {
  getAllOrders,
  createNewOrder,
  addCartToOrder,
  attachCartItemsToOrders,
  getOrderHistoryByUserId,
  updateSubmittedOrder,
  updateSingleItemInSubmittedOrder,
  removeSingleItemFromSubmittedOrder
}