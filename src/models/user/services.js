const { generateError } = require("../../utils/error");
const User = require("./");

exports.get = async (query) =>
  query._id
    ? User.findOne({ _id: query._id })
        .then((response) => (response ? response : generateError()))
        .catch((error) => error)
    : query.email || query.username
    ? User.findOne({
        $or: [{ username: query.username }, { email: query.email }],
      })
        .then((response) =>
          response
            ? response
            : query.username ? generateError("invalidUsername") : generateError('invalidEmail')
         )
          .catch((err) => err)
    : User.find()
        .then((response) => response)
        .catch((error) => error);

exports.create = (userData) =>
  User.create({ ...userData, createdAt: new Date() })
    .then((response) => response)
    .catch((error) => {
      console.error(error)
      return error;
    });

exports.findUsers = (query) =>
  User.find({ createdBy: query.createdBy })
    .then((response) => response)
    .catch((error) => {
      throw Error(error);
    });

exports.update = (queryObject, updateObject) =>
  User.updateOne(queryObject, { $set: updateObject })
    .then((response) => (response && response.n ? response : generateError()))
    .catch((error) => {
      throw Error(error);
    });
exports.exist = (phone) =>
  User.findOne({ phone: phone })
    .then((user) => (!user ? false : true))
    .catch((err) => false);

exports.getUser = async (query) =>
  User.findOne({ _id: query.id })
    .then((response) => (response ? response : generateError()))
    .catch((error) => error);

exports.deleteUser = async (mobile) =>
  User.deleteOne({ phone: mobile })
    .then((response) => (response ? response : null))
    .catch((error) => error);
//created At
//ExpiryTime
//new Date().getTime() + (3* 60 * 1000)
//phone:userData.phone,createdAt:new Date()
