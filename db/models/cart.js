/* eslint-disable no-useless-catch */
const client = require("../client")

async function createCart({
    name,
    price
}) {
    try {
        const { rows: [ cart ] } = await client.query(`
            INSERT INTO cart(name,price)
            VALUES($1, $2)
            RETURNING *;
        `, [name, price]);
        return cart;
    }catch(error){
        throw error
    }
}

module.exports = {
    createCart
}