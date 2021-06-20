const { generateError } = require("../../utils/error");
const Corpus = require(".");
const mongoose = require("mongoose");

exports.findCorpus = (query) =>
  Corpus.findOne({ ...query }).then((response) => response ? response : null)
    .catch((error) => {
      console.error(error);
      return error;
    });



exports.createCorpus = (corpusData) =>
  Corpus.create({ ...corpusData, createdAt: new Date() })
    .then((response) => response ? response : null)
    .catch((error) => {
      console.error(error);
      return error;
    });

exports.updateCorpus = (queryObject, updateObject) => 
    Corpus.updateOne(queryObject, { $set: updateObject }) 
    .then((response) => response.n ? true : null)
    .catch((error) => {
      console.error(error);
      return error;
    });