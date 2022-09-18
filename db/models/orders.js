/* eslint-disable no-useless-catch */
const client = require("../client")

async function createNewOrder({userId, price}){
  try {
    const { rows: [order] } = await client.query(`
      INSERT INTO orders("userId", price)
      VALUES($1, $2)
      RETURNING*
    `, [userId, price]);
    console.log('order in createNewOrder', order);

    console.log('submitted to addCartToOrder:', {orderId: order.id, userId});
    const cartAdded = await addCartToOrder({orderId: order.id, userId});
    console.log('cartAddedToOrder', cartAdded);

    const orderWithCartItemsAttached = await attachCartItemsToOrders([order]);

    return orderWithCartItemsAttached;
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
  
      console.log('HELLO, cartItems addCartToOrder fn', cartItemsToOrder)
      return cartItemsToOrder;
  } catch (error) {
    throw error
  }
}

async function attachCartItemsToOrders(orders) {
  console.log('orders in attach fn', orders);
  const ordersToReturn = [...orders];
  console.log('ordersToReturn in attach fn', ordersToReturn);
  const conditions = orders.map((_, index) => `$${index + 1}`).join(', ');
  console.log('conditions', conditions);
  const orderIds = orders.map(order => order.id);
  console.log('orderIds', orderIds);
  if (!orderIds?.length) return;
  try {
    const { rows: cartItems } = await client.query(`
      SELECT inventory.id AS "inventoryId", inventory.name, inventory.description, cart_inventory.quantity, cart_inventory.price, cart_inventory.id
        AS "cartInventoryId", cart_inventory."orderId"
      FROM inventory
      JOIN cart_inventory ON cart_inventory."inventoryId" = inventory.id
      WHERE cart_inventory."orderId" IN (${conditions});
    `, orderIds);
    console.log('cartItems in attach fn', cartItems);

    for (const order of ordersToReturn) {
      const itemsToAdd = cartItems.filter(item => item.orderId === order.id);
      delete itemsToAdd.purchasedCount;
      delete itemsToAdd.stock;
      
      console.log('itemsToAdd', itemsToAdd)
      order.items = itemsToAdd;
    }
    console.log('orders to return at end of attach fn', ordersToReturn)
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

// TODO: update order and/or items in order

module.exports = {
  createNewOrder,
  addCartToOrder,
  attachCartItemsToOrders,
  getOrderHistoryByUserId
}