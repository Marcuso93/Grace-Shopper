/* eslint-disable no-useless-catch */
const client = require("../client")

async function createInventory({
    name, 
    category, 
    description, 
    price, 
    purchasedCount, 
    stock,
    isPublic
    }) {
   try {
     const { rows: [ inventory ] } = await client.query(`
     INSERT INTO inventory( name, category, description, price, "purchasedCount", stock, "isPublic") 
     VALUES($1, $2, $3, $4, $5, $6, $7)  
     RETURNING *;
     `, [name, category, description, price, purchasedCount, stock, isPublic]);
  
     return inventory;
   } catch (error) {
     throw error;
   }
  }

module.exports = {
    createInventory
}