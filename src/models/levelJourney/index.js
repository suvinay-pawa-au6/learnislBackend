const mongoose = require("mongoose");
const LevelJourneySchema = require("./schema")

const LevelJourney = mongoose.model("LevelJourney", LevelJourneySchema);

module.exports = LevelJourney;