const Sequelize = require("sequelize");

const sequelize = new Sequelize("tododb", "todo", "todopass", {
  host: "localhost",
  dialect: "mariadb"
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection established");
  })
  .catch(err => {
    console.log(`Error establishing database connection: ${err}`);
    process.exit();
  });

//Define table schemas
const User = sequelize.define("user", {
  username: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  isAdmin: {
    type: Sequelize.BOOLEAN
  }
});

const Chatroom = sequelize.define("chatroom", {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

const Message = sequelize.define("message", {
  content: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

Chatroom.hasMany(Message)
Message.belongsTo(Chatroom)
User.hasMany(Chatroom)
Chatroom.belongsTo(User)
User.hasMany(Message)
Message.belongsTo(User)

User.sync().catch(err => {
	console.log(`Error synchronizing the users table: ${err}`)
	process.exit()
})

Chatroom.sync().catch(err => {
	console.log(`Error synchronizing the chatrooms table: ${err}`)
	process.exit()
})

Message.sync().catch(err => {
	console.log(`Error synchronizing the messages table: ${err}`)
	process.exit()
})

module.exports = { User, Chatroom, Message };
