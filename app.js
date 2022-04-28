const server = require("http").createServer();
const io = require("socket.io")(server, {
  transports: ["websocket", "polling"],
});
const users = {};

io.on("connection", (client) => {
  client.on("username", (username) => {
    const user = {
      name: username,
      id: client.id,
    };
    users[client.id] = user;
    io.emit("connected", user);
    io.emit("message", { text: `knock knock ${username}` });
    io.emit("users", Object.values(users));
  });

  client.on("send", (message) => {
    io.emit("message", {
      text: message,
      user: users[client.id],
    });
  });

  client.on("disconnect", () => {
    const username = users[client.id]?.name;
    delete users[client.id];
    io.emit("disconnected", client.id);
    if (username) {
      io.emit("message", { text: `matrix has ${username}` });
    }
  });
});

const port = process.env.PORT || 3001;

server.listen(port);
