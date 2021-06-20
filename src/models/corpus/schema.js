
const { Schema } = require("mongoose");

const corpusSchema = new Schema({
  series: { type: String },
  island: { type: String },
  seriesId: { type: Schema.Types.ObjectId },
  islandId: { type: Schema.Types.ObjectId},
  corpusArray: [{Corpus: String , TextDesc : String , Tag : String}],
  deletedAt: { type: Date },
  createdAt: { type: Date },
  deletedBy: { type: String },
  createdBy: { type: Schema.Types.ObjectId },
});

module.exports = corpusSchema;
