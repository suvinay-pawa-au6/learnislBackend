const { Router } = require("express");
const { testCsv, testCorpus, uploadAssets, uploadQuiz, uploadCorpus, fetchContent, fetchCorpus, fetchQuiz, deleteFilesAWS } = require("./controller")
const cmsRouter = Router()
const { upload } = require("../../libs/multer/multer")

cmsRouter.get('/testCsv', testCsv)
cmsRouter.get('/testCorpus', testCorpus)

cmsRouter.post('/upload', upload.array('files'), uploadAssets)
cmsRouter.post('/delete', deleteFilesAWS)

cmsRouter.post('/quiz', upload.array('files'), uploadQuiz)
cmsRouter.post('/corpus', upload.array('files'), uploadCorpus)
cmsRouter.get('/content', fetchContent)
cmsRouter.get('/corpus', fetchCorpus)
cmsRouter.get('/quiz', fetchQuiz)


module.exports = cmsRouter