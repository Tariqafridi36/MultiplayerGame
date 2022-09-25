const { Double } = require("mongodb");
const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  Player: {
    type: String,
    required: true,
  },
  Guessednumber: {
    type: Double,
    required: true,
  },
  Credit: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("RoundHistory", historySchema);
