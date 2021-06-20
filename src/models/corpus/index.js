const mongoose = require("mongoose");
const CorpusSchema = require("./schema")

const Corpus = mongoose.model("Corpus", CorpusSchema);

module.exports = Corpus;