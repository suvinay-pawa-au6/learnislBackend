const { generateError } = require("../../utils/error");
const Journey = require("./");
const mongoose = require("mongoose");

exports.findJourney = (query) =>
  Journey.findOne({ ...query }).then((response) => response ? response : null)
    .catch((error) => {
      console.error(error);
      return error;
    });



exports.createJourney = (userData) =>
  Journey.create({ ...userData, createdAt: new Date() })
    .then((response) => response ? response : null)
    .catch((error) => {
      console.error(error);
      return error;
    });

exports.updateJourney = (queryObject, updateObject) => 
    Journey.updateOne(queryObject, { $set: updateObject }) 
    .then((response) => response.n ? true : null)
    .catch((error) => {
      console.error(error);
      return error;
    });