const mongoose = require("mongoose");
const IslandsSchema = require("./schema")

const Islands = mongoose.model("Islands", IslandsSchema);

module.exports = Islands;