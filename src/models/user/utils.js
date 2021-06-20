const mongoose = require("mongoose");
const { STATUS } = require("../../utils/constants");
const { OTP_EXPIRY } = require("./constants");
const { Schema } = mongoose;
const { exist, update, create } = require("./services");

const OtpSchema = new Schema({
  expiry: { type: Date, required: true },
  value: { type: Number, required: true },
});

const LocationSchema = new Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});

const createUser = async (data) => {
  const value = await exist(data.phone);
  console.log(value);
  return value
    ? update(
      { phone: data.phone },
      { otp: { expiry: new Date().getTime() + OTP_EXPIRY, value: data.otp } }
    ).then((user) => {
      console.log("user: ", user);
      return user;
    })
    : create({
      phone: data.phone,
      otp: { expiry: new Date().getTime() + OTP_EXPIRY, value: data.otp },
      status: STATUS.UNVERIFIED,
    }).then((user) => user);
};

const updateOptin = async (id) =>
  update({ _id: id }, { optinDate: new Date(), status: STATUS.OPTEDIN })
    .then((user) => STATUS.OPTEDIN)
    .catch((err) => err);

exports.OtpSchema = OtpSchema;
exports.createUser = createUser;
exports.LocationSchema = LocationSchema;
exports.updateOptin = updateOptin;
