const mongoose = require("mongoose");
const SeriesSchema = require("./schema")

const Series = mongoose.model("Series", SeriesSchema);

module.exports = Series;