const csv = require("csvtojson");
const request = require("request");
const { csvToJson } = require("../../utils/general")
const { questionsArrayFormatter, awsPathGenerator, awsAssetPathGenerator, awsListAssetPathGenerator, awsListPathGenerator } = require("./utils")
const { uploadFiles } = require(".././../libs/aws/upload")
const { listFiles } = require("../../libs/aws/listFiles")
const { findIslands } = require("../../models/islands/services")
const { fetchSeries } = require("../../models/series/services")
const { insertQuestions } = require("../../models/questions/services")
const { deleteFiles } = require("../../libs/aws/deleteFiles")
const { createCorpus } = require("../../models/corpus/services")
exports.testCsv = async (req, res, next) => {

   let fileName = 'Level 01'
   let questionsArray = await csvToJson('https://novasign-content.s3.ap-south-1.amazonaws.com/Level1+-+Sheet1.csv')
   let islandData = await findIslands({ name: req.query.island })
   let { _id } = await fetchSeries({ name: islandData[0].series })
   let leveldetails = islandData[0].levels.find((level) => level.levelName == fileName)
   let formattedQuestions = await questionsArrayFormatter(questionsArray, { seriesId: _id, series: islandData[0].series, island: islandData[0].name, islandId: islandData[0]._id, level: leveldetails.levelName, levelId: leveldetails._id })
   console.log(formattedQuestions)
   let insertedQuestions = await insertQuestions(formattedQuestions)
   res.json(insertedQuestions)
}

exports.testCorpus = async (req, res) => {
   let url = "https://novasign-content.s3.ap-south-1.amazonaws.com/Corpus/wind/alphabet/Corpus.csv"
   let corpusArray = await csvToJson(url)
   let islandData = await findIslands({ name: req.query.island })
   let { _id } = await fetchSeries({ name: islandData[0].series })
   let corpus = await createCorpus({ corpusArray , seriesId: _id, series: islandData[0].series, island: islandData[0].name, islandId: islandData[0]._id, })
   res.json(corpus)
}
exports.uploadAssets = async function (req, res) {
   try {
      console.log(req.files)
      const { files } = req
      if (!files.length) res.status(400).send('No file uploaded.')

      let finalbucket = await awsAssetPathGenerator(req)
      console.log(finalbucket)
      let uploadedFiles = await uploadFiles(finalbucket, files)

      res
         .status(200)
         .send({ status: 'success', message: 'files uploaded successfully', uploadedFiles: uploadedFiles })
   } catch (error) {
      throw error
   }
}

exports.uploadCorpus = async function (req, res) {
   try {
      console.log(req.files)
      const { files } = req
      if (!files.length) res.status(400).send('No file uploaded.')

      let finalbucket = await awsPathGenerator(req, 'Corpus')
      console.log(finalbucket)
      let uploadedFiles = await uploadFiles(finalbucket, files)

      res
         .status(200)
         .send({ status: 'success', message: 'files uploaded successfully', uploadedFiles: uploadedFiles })
   } catch (error) {
      throw error
   }
}

exports.uploadQuiz = async function (req, res) {
   try {
      console.log(req.files)
      const { files } = req
      if (!files.length) res.status(400).send('No file uploaded.')

      let finalbucket = await awsPathGenerator(req, 'Quiz')
      console.log(finalbucket)
      let uploadedFiles = await uploadFiles(finalbucket, files)

      res
         .status(200)
         .send({ status: 'success', message: 'files uploaded successfully', uploadedFiles: uploadedFiles })
   } catch (error) {
      throw error
   }
}

exports.fetchContent = async (req, res) => {
   let finalbucket = await awsListAssetPathGenerator(req)
   let assets = await listFiles(finalbucket, req.query.contentType)
   console.log(assets)
   res
      .status(200)
      .send({ status: 'success', message: 'files listed successfully', files: assets })
}

exports.fetchCorpus = async (req, res) => {
   let finalbucket = await awsListPathGenerator(req, 'Corpus')
   let assets = await listFiles(finalbucket, "Corpus")
   console.log(finalbucket)
   res
      .status(200)
      .send({ status: 'success', message: 'files listed successfully', files: assets })
}

exports.fetchQuiz = async (req, res) => {
   let finalbucket = await awsListPathGenerator(req, 'Quiz')
   let assets = await listFiles(finalbucket, "Quiz")
   console.log(assets)
   res
      .status(200)
      .send({ status: 'success', message: 'files listed successfully', files: assets })
}

exports.deleteFilesAWS = async (req, res) => {
   let files = req.body.paths
   let deletedFiles = await deleteFiles(files)
   console.log(deletedFiles)
   if (deletedFiles.success) {
      res
         .status(200)
         .send({ status: 'success', message: 'files deleted successfully' })
   }
   else {
      res
         .status(404)
         .send({ status: 'fail', message: 'files were not deleted ' })
   }

}