const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

//Define API Routes
const user = require("./user");
app.use("/user", user);

const chatroom = require("./chatroom");
app.use("/chatroom", chatroom)

module.exports = { path: "/api", handler: app };
