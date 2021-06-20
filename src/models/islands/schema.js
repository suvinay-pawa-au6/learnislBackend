
const { Schema } = require("mongoose");
const { GENDER, STATUS_ENUM } = require("./constants");

const IslandSchema = new Schema({
  name: { type: String, unique: true },
  levels: [{levelName:String}],
  order: { type:Number },
  medals: { type: Number},
  series: { type: String},
  deletedAt: { type: Date },
  createdAt: { type: Date },
  deletedBy: { type: String },
  createdBy: { type: Schema.Types.ObjectId },
});

module.exports = IslandSchema;
