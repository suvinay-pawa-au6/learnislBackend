const { format } = require("morgan")

exports.awsAssetPathGenerator = ((req) => {
    let contentType = req.query.contentType
    let bucket = req.query.series
        ? `${process.env.AWS_BUCKET_NAME}` +
        '/assets/' +
        `${contentType}` +
        '/' +
        `${req.query.series}`
        : `${process.env.AWS_BUCKET_NAME}` + '/assets/' + `${contentType}`

    let finalbucket = req.query.island
        ? bucket + '/' + `${req.query.island}`
        : bucket
    return finalbucket
})

exports.awsListAssetPathGenerator = ((req) => {
    let contentType = req.query.contentType
    let bucket = req.query.series
        ? 'assets/' +
        `${contentType}` +
        '/' +
        `${req.query.series}`
        : 'assets/' + `${contentType}`

    let finalbucket = req.query.island
        ? bucket + '/' + `${req.query.island}`
        : bucket
    return finalbucket
})


exports.awsListPathGenerator = ((req, contentType) => {

    let bucket = req.query.series
        ?
    
        `${contentType}` +
        '/' +
        `${req.query.series}`
        : '/' + `${contentType}`

    let finalbucket = req.query.island
        ? bucket + '/' + `${req.query.island}`
        : bucket
    return finalbucket
})

exports.awsPathGenerator = ((req, contentType) => {

    let bucket = req.query.series
        ? `${process.env.AWS_BUCKET_NAME}` +
        '/' +
        `${contentType}` +
        '/' +
        `${req.query.series}`
        : `${process.env.AWS_BUCKET_NAME}` + '/' + `${contentType}`

    let finalbucket = req.query.island
        ? bucket + '/' + `${req.query.island}`
        : bucket
    return finalbucket
})
exports.questionsArrayFormatter = (questionsArray, seriesData) => {
    let formattedArray = []
    questionsArray.forEach(question => {
        let formattedQuestion = formatQuestion(question)
        formattedQuestion.level = seriesData.level
        formattedQuestion.island = seriesData.island
        formattedQuestion.series = seriesData.series
        formattedQuestion.levelId = seriesData.levelId
        formattedQuestion.islandId = seriesData.islandId
        formattedQuestion.seriesId = seriesData.seriesId
        formattedArray.push(formattedQuestion)
        formattedQuestion = {}
    })
    return(formattedArray)
}

let formatQuestion = ({ questionType, options, answer, subText, randomOptions }) => {
    let formattedQuestion = {}
    switch (questionType) {

        case 'mcqText':
        case 'noMatch':
        case 'mcqGif': {

            formattedQuestion.questionType = questionType
            formattedQuestion.answer = [options]
            formattedQuestion.randomOptions = parseInt(randomOptions)
        }
            break;
        case 'match':
            {
                formattedQuestion.questionType = questionType
                formattedQuestion.options = options.split(',')
            }
            break;
        case 'hotspotArea':
        case 'oddOneOut':
            {

                formattedQuestion.questionType = questionType
                formattedQuestion.options = options.split(',')
                formattedQuestion.answer = [answer]
                subText ? formattedQuestion.subtext = subText : null
            }
            break;

    }
    return (formattedQuestion)
}
