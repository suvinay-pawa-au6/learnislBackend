const { generateError } = require("../../utils/error");
const Questions = require("./");
const mongoose = require("mongoose");

exports.insertQuestions = async (questions) =>
  Questions.insertMany(questions).then((response) => response).catch((Error) => Error)

exports.findQuestions = async (query) =>
  Questions.find({ query }).then((response) => response ? response : null).catch((Error) => Error)

exports.findQuestion = async (query) =>
  Questions.findOne({ ...query }).then((response) => response ? response : null).catch((Error) => Error)

exports.findQuestionIds = async (query) =>
  Questions.find({ ...query,   questionType: { $nin: ['hotspotArea', 'noMatch'] } }).distinct('_id').then((response) => response ? response : null).catch((Error) => Error)
