const { generateError } = require("../../utils/error");
const QuestionAttempts = require("./");
const mongoose = require("mongoose");

exports.findLatestQuestion = (query) =>
  QuestionAttempts.findOne({ ...query, $nor: [{ $and: [{ completed: true }, { attempted: true }] }] }).then((response) => response ? response : null)
    .catch((error) => {
      console.error(error);
      return error;
    });



exports.createQuestionAttempt = (attemptData) =>
  QuestionAttempts.create({ ...attemptData, createdAt: new Date() })
    .then((response) => response ? response : null)
    .catch((error) => {
      console.error(error);
      return error;
    });


exports.updateAttempt = (queryObject, updateObject) =>
  QuestionAttempts.updateOne(queryObject, { $set: updateObject })
    .then((response) => response.n ? true : null)
    .catch((error) => {
      console.error(error);
      return error;
    });

exports.findQuestionAttemptIds = async (query) =>
  QuestionAttempts.find({ ...query }).distinct('questionId').then((response) => response ? response : null).catch((Error) => Error)
