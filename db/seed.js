const {
  //client,
  // declare your model imports here
  createUser,
  createInventory,
  createReview,
  addItemToCart
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
      DROP TABLE IF EXISTS item_reviews;
      DROP TABLE IF EXISTS cart_inventory;
      DROP TABLE IF EXISTS reviews;
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
      description TEXT NOT NULL,
      price INTEGER,
      "purchasedCount" INTEGER,
      stock INTEGER,
      "isCustomizable" BOOLEAN DEFAULT true,
      "isActive" BOOLEAN DEFAULT true
    );
    CREATE TABLE reviews(
      id SERIAL PRIMARY KEY,
      "userId" INTEGER REFERENCES users(id),
      "itemId" INTEGER REFERENCES inventory(id),
      stars INTEGER,
      "isActive" BOOLEAN DEFAULT true,
      description TEXT NOT NULL
      );
    CREATE TABLE cart_inventory(
      id SERIAL PRIMARY KEY, 
      "userId" INTEGER REFERENCES users(id),
      "inventoryId" INTEGER REFERENCES inventory(id),
      quantity INTEGER,
      price INTEGER,
      "isPurchased" BOOLEAN DEFAULT false,
      UNIQUE ("inventoryId", "userId")
    );
    CREATE TABLE item_reviews(
      id SERIAL PRIMARY KEY,
      "itemId" INTEGER REFERENCES inventory(id),
      "reviewId" INTEGER REFERENCES reviews(id),
      "isActive" BOOLEAN DEFAULT true
      );
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
      { username: "sandra", password: "sandra123", address: "Denver", fullname: "Sandra Copper", email: "Sandra@aol.com" },
      { username: "glamgal", password: "glamgal123", address: "Fort Collins", fullname: "Shrimp Man", email: "Shrimp@gmail.com" },
      { username: "marcus", password: "1234BigMoney", address: "Golden", fullname: "Marcus Ortega", email: "Marcus@gmail.com", isAdmin: true },
    ]
    const users = await Promise.all(usersToCreate.map(createUser))
    console.log("USERS", users)
    console.log("Finish creating users...")

    console.log("Starting to create inventory...")
    const inventoryToCreate = [
      {
        name: "work desk",
        price: "150",
        description: "beetle kill wood and epoxy",
        purchasedCount: "0",
        stock: "10",
        isActive: "true",
        isCustomizable: "false"
      },

      {
        name: "cutting board",
        price: "65",
        description: "hard wood with custom laser engraving",
        purchasedCount: "0",
        stock: "10",
        isActive: "true",
        isCustomizable: "true"
      },
    ]
    const inventory = await Promise.all(inventoryToCreate.map(createInventory))
    console.log(inventory)
    console.log("Finish creating inventory...")

    console.log("Starting to create reviews...")
    const reviewsToCreate = [
      { userId: 1, itemId: 1, stars: 5, description: "This is quite possiably the best work desk thats ever existed in the history of man" },
      { userId: 2, itemId: 1, stars: 4, description: "This work desk is so good i can't physically leave it four stars for being waaaaay too good" },
      { userId: 3, itemId: 2, stars: 4, description: "I will uses this when I cook! also this thing is so sturdy i could rely on it to fight off the law " },
      { userId: 4, itemId: 2, stars: 3, description: "Could use some more wood-work." },
    ]
    const reviews = await Promise.all(reviewsToCreate.map(createReview))
    console.log(reviews)
    console.log("Finish creating reviews...")
    
    console.log('Building cart...');
    const cartItems = [
      { userId: 1, inventoryId: 1, quantity: 2, price: 5000 },
      { userId: 1, inventoryId: 2, quantity: 5, price: 10 }
    ]
    const cart = await Promise.all(cartItems.map(addItemToCart));
    console.log('cart:', cart);
    console.log('Finished building cart...')

    console.log("Finished creating tables!")

  } catch (error) {
    console.error("Error creating tables!")
    throw error
  }
}
  

buildTables()
  .then(createInitialData)
  .catch(console.error)
  .finally(() => client.end());

// CREATE TABLE carts(
//   id SERIAL PRIMARY KEY,
//   "userId" INTEGER REFERENCES users(id),
//   "inventoryId" INTEGER REFERENCES inventory(id),
//   quantity INTEGER,
//   price INTEGER,
//   "isPurchased" BOOLEAN DEFAULT false
// );