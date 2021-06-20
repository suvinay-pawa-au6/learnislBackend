const { generateError } = require("../../utils/error");
const Series = require(".");
const mongoose = require("mongoose");
exports.getSeries = async (query) =>
  Series.find({})
    .then((series) => series)
    .catch((err) => err);

exports.fetchSeries = async (query) =>
Series.findOne({...query})
.then((series) => series)
.catch((err) => err);

exports.createSeries = (userData) =>
  Series.create({ ...userData, createdAt: new Date() })
    .then((response) => response)
    .catch((error) => {
      console.error(error);
      return error;
    });

exports.findUsers = (query) =>
  Series.find({ createdBy: query.createdBy })
    .then((response) => response)
    .catch((error) => {
      throw Error(error);
    });

exports.update = (queryObject, updateObject) =>
  Series.updateOne(queryObject, { $set: updateObject })
    .then((response) => (response && response.n ? response : generateError()))
    .catch((error) => {
      throw Error(error);
    });
exports.exist = (phone) =>
  Series.findOne({ phone: phone })
    .then((user) => (!user ? false : true))
    .catch((err) => false);

exports.getUser = async (query) =>
  Series.findOne({ _id: query.id })
    .then((response) => (response ? response : generateError()))
    .catch((error) => error);

exports.deleteUser = async (mobile) =>
  Series.deleteOne({ phone: mobile })
    .then((response) => (response ? response : null))
    .catch((error) => error);
//created At
//ExpiryTime
//new Date().getTime() + (3* 60 * 1000)
//phone:userData.phone,createdAt:new Date()
