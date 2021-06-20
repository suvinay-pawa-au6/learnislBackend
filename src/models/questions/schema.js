
const { Schema } = require("mongoose");

const QuestionsSchema = new Schema({
  questionType: { type: String },
  options: [{ type: String }],
  answer: [{ type: String }],
  randomOptions: { type: Number },
  subText: { type: String },
  level: { type: String },
  series: { type: String },
  island: { type: String },
  levelId: { type: Schema.Types.ObjectId },
  seriesId: { type: Schema.Types.ObjectId },
  islandId: { type: Schema.Types.ObjectId},
  deletedAt: { type: Date },
  createdAt: { type: Date },
  deletedBy: { type: String },
  createdBy: { type: Schema.Types.ObjectId },
});

module.exports = QuestionsSchema;
