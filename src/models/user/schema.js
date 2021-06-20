const OtpSchema = require("./utils");
const LocationSchema = require("./utils");
const { Schema } = require("mongoose");
const { GENDER, STATUS_ENUM } = require("./constants");

const UserSchema = new Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: { type: String },
  status: { type: String, enum: STATUS_ENUM },
  otp: { type: Number },
  socialLogin: { type: Boolean },
  status: { type: String },
  userType: { type: String },
  signlanguage: { type: String },
  organizationCode: { type: String },
  classCode: { type: String },
  currentIsland: { type: Schema.Types.ObjectId },
  streak: { type: Number },
  points: { type: Number },
  deletedAt: { type: Date },
  createdAt: { type: Date },
  deletedBy: { type: String },
  createdBy: { type: Schema.Types.ObjectId },
});

module.exports = UserSchema;
