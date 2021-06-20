const { generateError } = require("../../utils/error");
const Islands = require("./");
const mongoose = require("mongoose");
exports.getIsland = async (query) =>
  query.id
    ? Islands.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(query.id) } },
      {

        $addFields: {
          levels: {
            $map: {
              input: "$levels",
              as: "level",
              in: { levelId: "$$level._id", levelName: "$$level.levelName", completionRate: -1 },
            },
          },
        },
      },
      { $addFields: { islandId: "$_id" } },
      { $unset: ["_id"] }
    ])
      .then((response) => response)
      .catch((error) => error)
    : Islands.aggregate([
      {
        $addFields: {
          levels: {
            $map: {
              input: "$levels",
              as: "level",
              in: { levelId: "$$level._id", levelName: "$$level.levelName" },
            },
          },
        },
      },
      { $addFields: { islandId: "$_id", medals: { $size: "$levels" } } },
      { $unset: ["_id"] },
      { $sort: { order: 1 } }
    ])
      .then((response) => response)
      .catch((error) => error);

exports.create = (userData) =>
  Islands.create({ ...userData, createdAt: new Date() })
    .then((response) => response)
    .catch((error) => {
      console.error(error);
      return error;
    });

exports.findIslands = (query) =>
  Islands.find({ ...query }).then((response) => response)
    .catch((error) => {
      console.error(error);
      return error;
    });
exports.findUsers = (query) =>
  Islands.find({ createdBy: query.createdBy })
    .then((response) => response)
    .catch((error) => {
      throw Error(error);
    });

exports.update = (queryObject, updateObject) =>
  Islands.updateOne(queryObject, { $set: updateObject })
    .then((response) => (response && response.n ? response : generateError()))
    .catch((error) => {
      throw Error(error);
    });
exports.exist = (phone) =>
  Islands.findOne({ phone: phone })
    .then((user) => (!user ? false : true))
    .catch((err) => false);

exports.getUser = async (query) =>
  Islands.findOne({ _id: query.id })
    .then((response) => (response ? response : generateError()))
    .catch((error) => error);

exports.deleteUser = async (mobile) =>
  Islands.deleteOne({ phone: mobile })
    .then((response) => (response ? response : null))
    .catch((error) => error);
//created At
//ExpiryTime
//new Date().getTime() + (3* 60 * 1000)
//phone:userData.phone,createdAt:new Date()
