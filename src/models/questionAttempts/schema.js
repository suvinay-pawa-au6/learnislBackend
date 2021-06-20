
const { Schema } = require("mongoose");

const questionAttemptsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId },
  levelId: { type: Schema.Types.ObjectId },
  journeyId: { type: Schema.Types.ObjectId },
  questionId: { type: Schema.Types.ObjectId },
  options: [{ text: String, imageUrl: String, gifUrl: String, videoUrl: String }],
  multiQuestions: [{ text: String, imageUrl: String, gifUrl: String, videoUrl: String }],
  multiAnswers: [[Number, Number]],
  question: { text: String, imageUrl: String, gifUrl: String, videoUrl: String },
  current : Number, 
  total  : Number,
  answer: Number,
  questionType: String,
  totalXp: { type: Number, default: 0 },
  totalTime: { type: Number, default: 0 },
  correct: { type: Boolean, default: false },
  attempted: { type: Boolean },
  completed: { type: Boolean },
  deletedAt: { type: Date },
  createdAt: { type: Date },
  deletedBy: { type: String },
  createdBy: { type: Schema.Types.ObjectId },
});

module.exports = questionAttemptsSchema;
