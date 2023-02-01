const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const PORT = 5000 || process.env.PORT;
const { Server } = require("socket.io");
const io = new Server(server);
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  console.log("user : " + username);
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  next();
});

io.on("connection", (socket) => {
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({ userId: id, username: socket.username });
  }
  // send list of users to client
  socket.emit("users", users);

  // notify existing users
  socket.broadcast.emit("user connected", {
    userId: socket.id,
    username: socket.username,
  });
});

app.get((req, res) => {
  res.sendFile(__dirname + "/index.html");
});
server.listen(PORT, () => {
  console.log("Server listen on port : " + PORT);
});
