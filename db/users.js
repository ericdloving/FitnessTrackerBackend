/* eslint-disable no-useless-catch */
const client = require("./client");
const bcrypt = require("bcrypt");
const SALT_COUNT = 10;

//this is just a test

// database functions

// user functions
async function createUser({ username, password }) {
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    INSERT INTO users(username, password) 
    VALUES($1, $2) 
    ON CONFLICT (username) DO NOTHING 
    RETURNING id,username;
    `,
      [username, hashedPassword]
    );
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    SELECT *
    FROM users
    WHERE username=$1
  `,
      [username]
    );
    if (user) {
      const hash = await bcrypt.compare(password, user.password);
      if (hash) {
        const strippedUser = { id: user.id, username: user.username };
        return strippedUser;
      } else return false; //login failed
    }
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    SELECT *
    FROM users
    WHERE id = $1;
    `,
      [userId]
    );
    return { id: user.id, username: user.username };
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(userName) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT *
      FROM users
      WHERE username=$1;
    `,
      [userName]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};

