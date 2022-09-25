const Player = require("./models/player");
const RoundHistory = require("./models/roundhistory");

module.exports = {
  getPalyers: async () => {
    return await Player.find();
  },

  addRoundHistory: async (data) => {
    const history = new RoundHistory({
      Player: data.player,
      Guessednumber: data.guessednumber,
      Credit: data.credit,
    });
    try {
      await history.save();
    } catch (error) {
      console.log(error);
    }
  },
};
