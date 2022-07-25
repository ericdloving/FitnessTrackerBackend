const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {//wouldn't accept try catch 
  const {
    rows: [user],
  } = await client.query(
    `
    INSERT INTO users(username, password) 
    VALUES($1, $2) 
    ON CONFLICT (username) DO NOTHING 
    RETURNING id,username;
    `,
    [username, password]
  );
  return user;
}

async function getUser({ username, password }) {}

async function getUserById(userId) {}

async function getUserByUsername(userName) {}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
