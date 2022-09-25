const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  player: {
    type: String,
    required: true,
  },
  credit: {
    type: Number,
    required: true,
  },
  guessedNumber: {
    type: Number,
  },
});

module.exports = mongoose.model("Player", playerSchema);
