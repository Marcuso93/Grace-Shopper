const {
  //client,
  // declare your model imports here
  createUser,
  createInventory,
  addToCart,
  createReviews,
  //createReviews
  // for example, User
} = require('./');

const client = require("./client")



async function buildTables() {
  try {
    client.connect();
    console.log("Dropping All Tables...")
    // drop tables in correct order
    await client.query(`
      DROP TABLE IF EXISTS cart_inventory;
      DROP TABLE IF EXISTS reviews;
      DROP TABLE IF EXISTS carts;
      DROP TABLE IF EXISTS inventory;
      DROP TABLE IF EXISTS users;
    `)

    // build tables in correct order
    console.log('hello again')
    await client.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      address VARCHAR(255),
      fullname VARCHAR(255),
      email VARCHAR(255),
      "isAdmin" BOOLEAN DEFAULT false
    );
    CREATE TABLE inventory(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      category VARCHAR(255),
      description TEXT NOT NULL,
      price INTEGER,
      "purchasedCount" INTEGER,
      stock INTEGER,
      "isCustomizable" BOOLEAN DEFAULT true,
      "isActive" BOOLEAN DEFAULT true
    );
    CREATE TABLE carts(
      id SERIAL PRIMARY KEY,
      "userId" INTEGER REFERENCES users(id),
      "inventoryId" INTEGER REFERENCES inventory(id),
      quantity INTEGER,
      price INTEGER,
      "isPurchased" BOOLEAN DEFAULT false
    );
    CREATE TABLE reviews(
      id SERIAL PRIMARY KEY,
      "userId" INTEGER REFERENCES users(id),
      "itemId" INTEGER REFERENCES inventory(id),
      username VARCHAR(255) UNIQUE NOT NULL,
      stars INTEGER,
      "isPublic" BOOLEAN DEFAULT true,
      description TEXT NOT NULL
    );
    CREATE TABLE cart_inventory(
      id SERIAL PRIMARY KEY, 
      "inventoryId" INTEGER REFERENCES inventory(id),
      "cartsId" INTEGER REFERENCES carts(id),
      quantity INTEGER,
      price INTEGER,
      UNIQUE ("inventoryId", "cartsId")
      )
  `)
    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}
async function createInitialData() {
  console.log("Starting to create users...")
  try {
    const usersToCreate = [
      { username: "albert", password: "bertie99", address: "colorado", fullname: "Albert Smith", email: "albert@gmail.com" },
      { username: "sandra", password: "sandra123", address: "Denver", fullname: "Sandra Copper", email: "Sandra@aol.com"},
      { username: "glamgal", password: "glamgal123", address: "Fort Collins", fullname: "Shrimp Man", email: "Shrimp@gmail.com" },
      { username: "marcus", password: "1234BigMoney", address: "Golden", fullname: "Marcus Ortega", email: "Marcus@gmail.com"},
    ]
    const users = await Promise.all(usersToCreate.map(createUser))
    console.log("USERS", users)
    console.log("Finish creating users...")

    console.log("Starting to create inventory...")
    const inventoryToCreate = [
      { 
        name: "work desk", 
        category: "table", 
        price: "150", 
        description: "beetle kill wood and epoxy", 
        purchasedCount: "0",
        stock: "10",
        isPublic: "false",
        isCustomizable: "false"
      },

      { 
        name: "cutting board", 
        category: "cutting board", 
        price: "65", 
        description: "hard wood with custom laser engraving", 
        purchasedCount: "0",
        stock: "10",
        isPublic: "false",
        isCustomizable: "true"
      },
    ]
    const inventory = await Promise.all(inventoryToCreate.map(createInventory))
    console.log(inventory)
    console.log("Finish creating inventory...")
    
    console.log("Starting to create carts...")
    const cartsToCreate = [
      { userId: 1, inventoryId: 2, quantity: 1, price: 65, isPurchased: false },
      { userId: 2, inventoryId: 1, quantity: 1, price: 150, isPurchased: false },
      // { name: 'glamgal', price: "65"},
      // { name: 'Marcus', price: "150"},
      // { name: 'albert', price: "65"}

      
    ]
    const cart = await Promise.all(cartsToCreate.map(addToCart))
    console.log(cart)
    console.log("Finish creating carts...")

    console.log("Starting to create reviews...")
    const reviewsToCreate =[
      {username: "albert", userId: 1, itemId: 1, stars: 5, description: "This is quite possiably the best work desk thats ever existed in the history of man" },
      {username: "sandra", userId: 2, itemId: 1, stars: 4, description: "This work desk is so good i can't physically leave it four stars for being waaaaay too good" },
      {username: "glamgal", userId: 3, itemId: 2, stars: 4, description: "I will uses this when I cook! also this thing is so sturdy i could rely on it to fight off the law " },
      {username: "Marcus", userId: 4, itemId: 2, stars: 3, description: "Could use some more wood-work." },
    ]
    const reviews = await Promise.all(reviewsToCreate.map(createReviews))
    console.log(reviews)
    console.log("Finish creating reviews...")

    console.log("Finished creating tables!")
    
  } catch (error) {
    console.error("Error creating tables!")
    throw error
  }
}

console.log('Starting to test cart.js');
const itemToAddToCart = {
  id: 1,
  name: "work desk",
  category: "table",
  price: "150",
  description: "beetle kill wood and epoxy",
  purchasedCount: "0",
  stock: "10",
  isPublic: "false"
}

buildTables()
  .then(createInitialData)
  .catch(console.error)
  .finally(() => client.end());