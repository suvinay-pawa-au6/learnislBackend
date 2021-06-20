
const { Schema } = require("mongoose");

const levelJourneySchema = new Schema({
  userId: { type: Schema.Types.ObjectId },
  levelId: { type: Schema.Types.ObjectId },
  totalXp:{type:Number , default : 0},
  totalTime: {type:Number , default : 0},
  currentStreak: { type:Number , default : 0},
  maxStreak: { type: Number , default : 0 },
  completed : {type : Boolean} , 
  attempts: [{type: Schema.Types.ObjectId}],
  deletedAt: { type: Date },
  createdAt: { type: Date },
  deletedBy: { type: String },
  createdBy: { type: Schema.Types.ObjectId },
});

module.exports = levelJourneySchema;
