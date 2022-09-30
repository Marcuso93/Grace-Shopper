const {
  //client,
  // declare your model imports here
  createUser,
  createInventory,
  createReview,
  createNewOrder,
  addItemToCart,
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
      DROP TABLE IF EXISTS orders;
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
        email VARCHAR(255) UNIQUE NOT NULL,
        "isAdmin" BOOLEAN DEFAULT false
      );
      CREATE TABLE inventory(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        image VARCHAR(255),
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
        username VARCHAR(255) REFERENCES users(username),
        "itemId" INTEGER REFERENCES inventory(id),
        stars INTEGER,
        "isActive" BOOLEAN DEFAULT true,
        description TEXT NOT NULL
      );
      CREATE TABLE orders(
        id SERIAL PRIMARY KEY,
        "orderDate" VARCHAR(255),
        "userId" INTEGER REFERENCES users(id),
        price INTEGER,
        inactivated BOOLEAN DEFAULT false
        );
      CREATE TABLE cart_inventory(
        id SERIAL PRIMARY KEY, 
        "userId" INTEGER REFERENCES users(id),
        "inventoryId" INTEGER NOT NULL REFERENCES inventory(id),
        quantity INTEGER,
        price INTEGER NOT NULL,
        "isPurchased" BOOLEAN DEFAULT false,
        "orderId" INTEGER REFERENCES orders(id) DEFAULT null
        );
        `)
          console.log("Finished building tables!");
          // "orderDate" TIMESTAMPTZ DEFAULT NOW(),
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
        name: "workshop or office desk",
        image: "./images/table-1.png",
        price: "150",
        description: "beetle kill wood and epoxy hand crafted to specifications sure to stand the test of time ",
        purchasedCount: "0",
        stock: "10",
        isActive: "true",
        isCustomizable: "false"
      },

      {
        name: "table",
        image: "./images/table-3.png",
        price: "75",
        description: "table made out of beetle kill wood and epoxy",
        purchasedCount: "0",
        stock: "5",
        isActive: "true",
        isCustomizable: "false"
      },

      {
        name: "table",
        image: "./images/table-4.png",
        price: "1500",
        description: "exoxy river table",
        purchasedCount: "0",
        stock: "2",
        isActive: "true",
        isCustomizable: "false"
      },

      {
        name: "cutting board",
        image: "./images/cutting-board-1.png",
        price: "65",
        description: "hard wood cutting board perfect for durablity when cutting meats and vegies with custom laser engraving for custom messages ",
        purchasedCount: "0",
        stock: "10",
        isActive: "true",
        isCustomizable: "true"
      },

      {
        name: "exquisite cutting board made from pine and maple",
        image: "./images/cutting-board-2.png",
        price: "65",
        description: "hard wood cutting board perfect for durablity when cutting meats and vegies with custom laser engraving for custom messages ",
        purchasedCount: "0",
        stock: "10",
        isActive: "true",
        isCustomizable: "true"
      },

      {
        name: "cutting board",
        image: "./images/cutting-board-3.png",
        price: "65",
        description: "hard wood cutting board perfect for durablity when cutting meats and vegies with custom laser engraving for custom messages ",
        purchasedCount: "0",
        stock: "10",
        isActive: "true",
        isCustomizable: "true"
      },

      {
        name: "cutting board",
        image: "./images/cutting-board-4.png",
        price: "65",
        description: "hard wood cutting board perfect for durablity when cutting meats and vegies with custom laser engraving for custom messages ",
        purchasedCount: "0",
        stock: "10",
        isActive: "true",
        isCustomizable: "true"
      },

      {
        name: "cutting board",
        image: "./images/cutting-board-5.png",
        price: "65",
        description: "hard wood cutting board perfect for durablity when cutting meats and vegies with custom laser engraving for custom messages ",
        purchasedCount: "0",
        stock: "10",
        isActive: "true",
        isCustomizable: "true"
      },

      {
        name: "cheess board",
        image: "./images/cutting-board-6.png",
        price: "45",
        description: "hard wood cutting board perfect for durablity when cutting meats and vegies with custom laser engraving for custom messages ",
        purchasedCount: "0",
        stock: "10",
        isActive: "true",
        isCustomizable: "true"
      },

      {
        name: "exquisite cutting board with epoxy",
        image: "./images/cutting-board-7.png",
        price: "65",
        description: "hard wood cutting board perfect for durablity when cutting meats and vegies with custom laser engraving for custom messages ",
        purchasedCount: "0",
        stock: "10",
        isActive: "true",
        isCustomizable: "false"
      },

      {
        name: "cutting board",
        image: "./images/cutting-board-8.png",
        price: "65",
        description: "hard wood cutting board perfect for durablity when cutting meats and vegies with custom laser engraving for custom messages ",
        purchasedCount: "0",
        stock: "5",
        isActive: "true",
        isCustomizable: "true"
      },

      {
        name: "Mini bar",
        image: "./images/mini-bar.png",
        price: "250",
        description: "mini bar made out of beetle kill wood",
        purchasedCount: "0",
        stock: "5",
        isActive: "true",
        isCustomizable: "false"
      },
      {
        name: "coasters",
        image: "./images/coasters.png",
        price: "30",
        description: "coasters with laser engraving",
        purchasedCount: "0",
        stock: "5",
        isActive: "true",
        isCustomizable: "false"
      },
      {
        name: "coasters",
        image: "./images/coasters-2.png",
        price: "25",
        description: "6 piece coaster set with flowing grain",
        purchasedCount: "0",
        stock: "3",
        isActive: "true",
        isCustomizable: "false"
      },
      {
        name: "colorado",
        image: "./images/colorado.png",
        price: "40",
        description: "colorado wall hanging",
        purchasedCount: "0",
        stock: "7",
        isActive: "true",
        isCustomizable: "false"
      },
      {
        name: "hangers",
        image: "./images/hangers.png",
        price: "35",
        description: "coat hangers",
        purchasedCount: "0",
        stock: "3",
        isActive: "true",
        isCustomizable: "false"
      },
      {
        name: "Ice cream",
        image: "./images/ice-cream.png",
        price: "25",
        description: "Ice cream wall art with epoxy coloring",
        purchasedCount: "0",
        stock: "5",
        isActive: "true",
        isCustomizable: "false"
      },
      {
        name: "tree of life",
        image: "./images/tree.png",
        price: "25",
        description: "tree of life with epoxy",
        purchasedCount: "0",
        stock: "5",
        isActive: "true",
        isCustomizable: "false"
      },
      {
        name: "yoda",
        image: "./images/yoda.png",
        price: "30",
        description: "yoda laser engraving, jamming out, wall art",
        purchasedCount: "0",
        stock: "10",
        isActive: "true",
        isCustomizable: "false"
      },
      {
        name: "yin-yang",
        image: "./images/yin-yang.png",
        price: "40",
        description: "yin-yang laser engraving, wall art",
        purchasedCount: "0",
        stock: "40",
        isActive: "true",
        isCustomizable: "false"
      },
    ]
    const inventory = await Promise.all(inventoryToCreate.map(createInventory))
    console.log(inventory)
    console.log("Finish creating inventory...")

    console.log("Starting to create reviews...")
    const reviewsToCreate = [
      { userId: 1, username: 'albert', itemId: 1, stars: 5, description: "This is quite possiably the best work desk thats ever existed in the history of man" },
      { userId: 2, username: 'sandra', itemId: 1, stars: 4, description: "This work desk is so good i can't physically leave it four stars for being waaaaay too good" },
      { userId: 3, username: 'glamgal', itemId: 2, stars: 4, description: "I will uses this when I cook! also this thing is so sturdy i could rely on it to fight off the law " },
      { userId: 4, username: 'marcus', itemId: 2, stars: 3, description: "Could use some more wood-work." },
    ]
    const reviews = await Promise.all(reviewsToCreate.map(createReview))
    console.log(reviews)
    console.log("Finish creating reviews...")
    
    console.log('Building carts...');
    const cartItems = [
      { userId: 1, inventoryId: 1, quantity: 2, price: 5000 },
      { userId: 1, inventoryId: 2, quantity: 5, price: 10 },
      { userId: 2, inventoryId: 1, quantity: 2, price: 5000 },
      { userId: 2, inventoryId: 2, quantity: 5, price: 10}
    ]
    const inventoryInCarts = await Promise.all(cartItems.map(addItemToCart));
    console.log('Inventory in carts:', inventoryInCarts);
    console.log('Finished building cart...')

    console.log('Building order...');
    const newOrderDate = new Date().toString();
    const order = await createNewOrder({userId: 1, price: 50000, orderDate: newOrderDate})
    console.log('ORDER:', order)
    console.log('Finished building order.')

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
// CREATE TABLE item_reviews(
//   id SERIAL PRIMARY KEY,
//   "itemId" INTEGER REFERENCES inventory(id),
//   "reviewId" INTEGER REFERENCES reviews(id),
//   "isActive" BOOLEAN DEFAULT true
// );