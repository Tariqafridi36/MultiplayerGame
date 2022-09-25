require("dotenv").config();
const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const mongoose = require("mongoose");
const {
  generateSecreteNumber,
  getPalyers,
  generateGussedNumber,
} = require("./utils");
const { addRoundHistory } = require("./service");

const app = express();
const server = http.createServer(app);

// setup DB get donnection string from ENV file
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Database connected"));

// Socket IO setup
const io = socketio(server);

// IO will make a connection when a client is connected
io.on("connection", (socket) => {
  socket.emit("secretNumber", generateSecreteNumber());
  socket.emit("getGuessNumbers", generateGussedNumber());
  socket.emit("createPlayer", getPalyers());
  socket.on("addhistory", (data) => {
    addRoundHistory(data);
  });
  // Get new Secret Number for another rounf
  socket.on("getSecretNumber", () => {
    const secret = generateSecreteNumber();
    socket.emit("secretNumber", secret);
  });
  // Get computer generated player's guessed number for next round
  socket.on("refershGessNumbers", () => {
    socket.emit("getGuessNumbers", generateGussedNumber());
  });
});

//Setup a stacic files for client
app.use(express.static(path.join(__dirname, "public")));

//Read port from ENV file or static port
const PORT = 2000 || process.env.PORT;

// server listner
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
