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

  async function getInventory(){
    try{
      const { rows: inventory } = await client.query(`
        SELECT *
        FROM inventory
      `)

      return inventory;

    }catch(error){
      throw error;
    }
  }

  async function getInventoryById(id){
    try{
      const { rows: [inventory] } = await client.query(`
        SELECT*
        FROM inventory WHERE id=$1
      `, [id]);

      if (!inventory) { return null }

      return inventory;
      
    }catch(error){
      throw error;
    }
  }

  async function getInventoryByName(name){
    try{
      const { rows: [inventory] } = await client.query(`
        SELECT*
        FROM inventory WHERE name=$1
      ` [name]);

      if (!inventory) { return null }

      return inventory;

    } catch (error) {
      throw error;
    }
  }

  async function updateInventory({inventoryId, ...fields}){
    const setString = Object.keys(fields).map(
      (key, index) => `"${key}" =$${index + 1}`
    ).join(', ');
    
    if (setString.length === 0) return;

    try {
      const { rows: [updatedInventory] } = await client.query(`
        UPDATE inventory
        SET ${setString}
          WHERE id=${inventoryId}
        RETURNING*;
      `, Object.values(fields));
      
      return updatedInventory;
    
    } catch (error) {
      throw error;
    }
  }

module.exports = {
    createInventory,
    getInventory,
    getInventoryById, 
    updateInventory
}