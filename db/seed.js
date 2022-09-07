const {
  client,
  // declare your model imports here
  createUser,
  createInventory,
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
    CREATE TABLE Reviews(
      id SERIAL PRIMARY KEY,
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
async function createInitialUsers() {
  console.log("Starting to create users...")
  try {
    const usersToCreate = [
      { username: "albert", password: "bertie99" },
      { username: "sandra", password: "sandra123" },
      { username: "glamgal", password: "glamgal123" },
    ]
    const users = await Promise.all(usersToCreate.map(createUser))

    const inventoryToCreate = [
      { name: "", category: "",price: "", description: "", }
    ]

    console.log("Users created:")
    console.log(users)
    console.log("Finished creating users!")
  } catch (error) {
    console.error("Error creating users!")
    throw error
  }
}

async function populateInitialData() {
  try {
    // create useful starting data by leveraging your
    // Model.method() adapters to seed your db, for example:
    // const user1 = await User.createUser({ ...user info goes here... })
  } catch (error) {
    throw error;
  }
}

buildTables()
  .then(populateInitialData)
  .catch(console.error)
  .finally(() => client.end());
