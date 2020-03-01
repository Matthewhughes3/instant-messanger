const express = require("express");
const router = express.Router();
const { Chatroom, Message, User } = require("./mysql");

//Create new chatroom
router.post("/", async (req, res) => {
  const users = await User.findAll({
    where: {
      id: req.body.id
    }
  }).catch(err => {
    throw new Error(`Error querying users table: ${err}`);
    res.status(500);
    return 1;
  });

  if (users.length > 0) {
    const user = users[0];
    if (user.isAdmin) {
      const chatrooms = await Chatroom.findAll({
        where: {
          name: req.body.name
        }
      }).catch(err => {
        throw new Error(`Error querying chatrooms table: ${err}`);
        res.status(500);
        return 1;
      });

      if (chatrooms.length === 0) {
        const newChatroom = await Chatroom.create({
          name: req.body.name,
          userId: req.body.id
        }).catch(err => {
          throw new Error(`Error creating new chatroom: ${err}`);
          res.status(500);
          return 1;
        });

        newChatroom.dataValues.user = user;

        res.json({ chatroom: newChatroom }).status(200);
      } else {
        res.json({ error: "Chatroom name already taken" }).status(200);
      }
    } else {
      throw new Error("User not authorized to create chatrooms");
      res.status(401);
      return 1;
    }
  } else {
    throw new Error("User not found");
    res.status(400);
    return 1;
  }
});

//Get all chatrooms
router.get("/", async (req, res) => {
  let chatrooms = await Chatroom.findAll({ include: User }).catch(err => {
    throw new Error(`Error querying the chatrooms table: ${err}`);
    res.status(500);
    return 1;
  });

  res.json({ chatrooms }).status(200);
});

//Get all messages for chatroom
router.get("/:id/messages", async (req, res) => {
  const chatrooms = await Chatroom.findAll({
    where: {
      id: req.params.id
    }
  }).catch(err => {
    throw new Error(`Error querying chatrooms table: ${err}`);
    res.status(500);
    return 1;
  });

  if (chatrooms.length > 0) {
    const chatroom = chatrooms[0];
    const messages = await chatroom.getMessages({ include: User });

    res.json({ messages }).status(200);
  } else {
    res.json({ error: "Chatroom not found" }).status(200);
  }
});

//Open Websocket
const WebSocketServer = require("ws").Server;

const wss = new WebSocketServer({ port: 40510 });

wss.on("connection", ws => {
  console.log("Socket connected");
  ws.on("message", message => {
    console.log(`Received message: ${message}`);
  });
});

//Send message
router.post("/:id", async (req, res) => {
	const newMessage = await Message.create({
		userId: req.body.id,
		chatroomId: req.params.id,
		content: req.body.message
	}).catch(err => {
		throw new Error(`Error creating new message: ${err}`);
		res.status(500);
		return 1;
	});

	const user = await newMessage.getUser();

	newMessage.dataValues.user = user;

	wss.clients.forEach(client => {
		client.send(JSON.stringify(newMessage));
	});

	res.json({ message: newMessage }).status(200);
});

//Delete chatroom by id
router.delete("/:id", async (req, res) => {
  await Chatroom.destroy({
    where: {
      id: req.params.id
    }
  }).catch(err => {
    throw new Error(`Error deleting from chatrooms table: ${err}`);
    res.status(500);
    return 1;
  });

  res.json({ id: req.params.id }).status(200);
});

module.exports = router;
