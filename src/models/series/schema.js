
const { Schema } = require("mongoose");
const { GENDER, STATUS_ENUM } = require("./constants");

const SeriesSchema = new Schema({
  name: { type: String, unique: true },
  islandsCount: { type: Number } ,
  icon: { type: String},
  deletedAt: { type: Date },
  createdAt: { type: Date },
  deletedBy: { type: String },
  createdBy: { type: Schema.Types.ObjectId },
});

module.exports = SeriesSchema;
