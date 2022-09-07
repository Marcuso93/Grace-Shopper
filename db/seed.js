const {
  client,
  // declare your model imports here
  createUser,
  createInventory,
  createReviews
  // for example, User
} = require('.');

async function buildTables() {
  try {
    client.connect();
    console.log("Dropping All Tables...")

    // drop tables in correct order
    await client.query(`
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS inventory;
      DROP TABLE IF EXISTS cart;
      DROP TABLE IF EXISTS reviews;
    `)

    // build tables in correct order

    await client.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );
    CREATE TABLE inventory(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      category VARCHAR(255),
      description TEXT NOT NULL,
      price INTEGER,
      purchasedCount INTEGER,
      stock INTEGER,
      "isPublic" BOOLEAN DEFAULT false,
    );
    CREATE TABLE cart(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      price INTEGER,
    );
    CREATE TABLE Reviews(
      id SERIAL PRIMARY KEY,
      "creatorId" INTEGER REFERENCES users(id),
      "itemId" INTEGER REFERENCES inventory(id),
      username VARCHAR(255) UNIQUE NOT NULL,
      stars INTEGER,
      description TEXT NOT NULL,
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
      { username: "albert", password: "bertie99" },
      { username: "sandra", password: "sandra123" },
      { username: "glamgal", password: "glamgal123" },
      { username: "marcus", password: "1234BigMoney" },
    ]
    const users = await Promise.all(usersToCreate.map(createUser))

    const inventoryToCreate = [
      { 
        name: "work desk", 
        category: "table", 
        price: "150", 
        description: "beetle kill wood and epoxy", 
        purchasedCount: "0",
        stock: "0",
        isPublic: "false"
      },

      { 
        name: "cutting board", 
        category: "cutting board", 
        price: "65", 
        description: "hard wood with custom laser engraving", 
        purchasedCount: "0",
        stock: "0",
        isPublic: "false"
      },
    ]
    const inventory = await Promise.all(inventoryToCreate.map(createInventory))
    
    const cartToCreate = [
      { name: 'albert', price: "150"},
      { name: 'sandra', price: "65"},
      { name: 'glamgal', price: "65"},
      { name: 'Marcus', price: "150"},
      { name: 'albert', price: "65"}
    ]
    const cart = await Promise.all(cartToCreate.map(createCart))

    const reviewsToCreate =[
      {username: "albert", creatorId: 1, itemId: 1, stars: 5, description: "This is quite possiably the best work desk thats ever existed in the history of man" },
      {username: "sandra", creatorId: 2, itemId: 1, stars: 4, description: "This work desk is so good i can't physically leave it four stars for being waaaaay too good" },
      {username: "glamgal", creatorId: 3, itemId: 2, stars: 4, description: "I will uses this when I cook! also this thing is so sturdy i could rely on it to fight off the law " },
      {username: "Marcus", creatorId: 4, itemId: 2, stars: 3, description: "Could use some more wood-work." },
    ]
    const reviews = await Promise.all(reviewsToCreate.map(createReviews))

    console.log("Users created:")
    console.log(users)
    console.log("Finished creating users!")
  } catch (error) {
    console.error("Error creating users!")
    throw error
  }
}


buildTables()
  .then(createInitialData)
  .catch(console.error)
  .finally(() => client.end());
