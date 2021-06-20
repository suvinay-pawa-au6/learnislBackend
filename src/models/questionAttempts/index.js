const mongoose = require("mongoose");
const QuestionAttemptsSchema = require("./schema")

const QuestionAttempts = mongoose.model("QuestionAttempts", QuestionAttemptsSchema);

module.exports = QuestionAttempts;