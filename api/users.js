/* eslint-disable no-useless-catch */
const express = require("express");
const {
  getUserByUsername,
  getUser,
  createUser,
  getPublicRoutinesByUser,
  getAllRoutinesByUser,
} = require("../db");
const { requireUser } = require("./utils");
const router = express.Router();
const jwt = require("jsonwebtoken");

// POST /api/users/register
router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (password.length < 8) {
      next({ name: "passwordLengthError", message: `Password Too Short!` });
    }
    const _user = await getUserByUsername(username);
    if (_user) {
      next({
        name: "userExistsError",
        message: `User ${username} is already taken.`,
      });
    }

    const user = await createUser({ username, password });

    const token = jwt.sign(
      {
        id: user.id,
        username,
      },
      process.env.JWT_SECRET
    );

    res.send({
      message: "thank you for signing up",
      token,
      user,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});
// POST /api/users/login
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }
  try {
    const user = await getUser({ username, password });

    if (user) {
      const { id, username } = user;
      const token = jwt.sign({ id, username }, process.env.JWT_SECRET);

      res.send({ user, message: "you're logged in!", token: `${token}` });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});
// GET /api/users/me
router.get("/me", requireUser, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch ({ name, message }) {
    next({ name, message });
  }
});
// GET /api/users/:username/routines
router.get("/:username/routines", async (req, res, next) => {
  const username = req.params.username;
  try {
    if (req.user && req.user.username === username) {
      const routines = await getAllRoutinesByUser({ username });
      res.send(routines);
    } else {
      const routines = await getPublicRoutinesByUser({ username });
      res.send(routines);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = router;
