/* eslint-disable no-useless-catch */
const client = require("../client")
const { getUserByUsername } = require('./user') 

async function addToCart({userId, inventoryId, quantity, price, isPurchased}) {
    try {
        const { rows: [ cart ] } = await client.query(`
            INSERT INTO carts("userId", "inventoryId", quantity, price, "isPurchased")
            VALUES($1, $2, $3, $4, $5)
            RETURNING *;
        `, [ userId, inventoryId, quantity, price, isPurchased ]);
        
        return cart;
    
    } catch (error) {
        throw error
    }
}

async function getCartByUsername(username) {
    try {
        const user = await getUserByUsername(username);

        const { rows: cart } = await client.query(`
            SELECT*
            FROM carts
            JOIN users ON carts."userId"=users.id
            WHERE "userId"=$1 AND "isPurchased"=false;
        `, [ user.id ])

        if (!cart) return null

        return cart;
        
    } catch (error) {
        throw error;
    }
}

async function removeItemFromCart(inventoryId) {
    try { 
            const { rows: [deletedItem]}  = await client.query(`
                DETETE
                FROM carts
                WHERE "inventoryId"=$1
                RETURNING *
            `, [inventoryId]);
            
            return deletedItem;

    } catch(error){
        throw error
    }
}



async function getPurchasedCartsByUsername(username){
    try {
        const user = await getUserByUsername(username);

        const { rows: carts } = await client.query(`
            SELECT*
            FROM carts
            JOIN users ON carts."userId"=users.id
            WHERE "userId"=$1 AND "isPurchased"=true;
        `, [user.id])

        if (!carts) return null

        return carts;

    } catch (error) {
        throw error;
    }
}

// TODO: will need a way to update all items in cart to "isPurchased"=true
async function updateCartToPurchased(cartId) {
    try {
        const { rows: [updatedCart] } = await client.query(`
            UPDATE carts
            SET "isPurchased"=true
            WHERE id=${cartId}
            RETURNING*;
      `, [cartId]);

        return updatedCart;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    addToCart,
    getCartByUsername,
    removeItemFromCart,
    getPurchasedCartsByUsername,
    updateCartToPurchased
}