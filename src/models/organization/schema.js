const { Schema } = require("mongoose");

const UserSchema = new Schema({
  organizationCode: { type: String, unique: true },
  classCodes: [{ type: String }],
  count: { type: Number },
  deletedAt: { type: Date },
  createdAt: { type: Date },
  deletedBy: { type: String },
  createdBy: { type: Schema.Types.ObjectId },
});

module.exports = UserSchema;
