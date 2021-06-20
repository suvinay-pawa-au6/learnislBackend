const mongoose = require("mongoose");
const QuestionsSchema = require("./schema")

const Questions = mongoose.model("Questions", QuestionsSchema);

module.exports = Questions;