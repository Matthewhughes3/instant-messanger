const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("./mysql");

const router = express.Router();

//Register new user
router.post("/", async (req, res) => {
  const users = await User.findAll({
    where: {
      username: req.body.username
    }
  }).catch(err => {
    throw new Error(`Error querying users table: ${err}`);
    res.status(500);
    return 1;
  });

  if (users.length === 0) {
    const passwordHash = await bcrypt.hash(req.body.password, 10).catch(err => {
      throw new Error(`Error hashing password: ${err}`);
      res.status(500);
      return 1;
    });

    const newUser = await User.create({
      username: req.body.username,
      password: passwordHash,
      isAdmin: false
    }).catch(err => {
      throw new Error(`Error creating new user: ${err}`);
      res.status(500);
      return 1;
    });

    res
      .json({
        id: newUser.id,
        username: newUser.username,
        isAdmin: newUser.isAdmin
      })
      .status(200);
  } else {
    res.json({ error: "User already exists" }).status(200);
    return 1;
  }
});

//User login
router.post("/login", async (req, res) => {
  const users = await User.findAll({
    where: {
      username: req.body.username
    }
  }).catch(err => {
    throw new Error(`Error querying users table: ${err}`);
    res.status(500);
    return 1;
  });

  if (users.length > 0) {
    const user = users[0];

    const verify = await bcrypt
      .compare(req.body.password, user.password)
      .catch(err => {
        throw new Error(`Error comparing password with hash: ${err}`);
        res.status(500);
        return 1;
      });

    if (verify) {
      res
        .json({ id: user.id, username: user.username, isAdmin: user.isAdmin })
        .status(200);
    } else {
      res.json({ error: "Incorrect username or password" }).status(200);
      return 1;
    }
  } else {
    res.json({ error: "Incorrect username or password" }).status(200);
    return 1;
  }
});

module.exports = router;
