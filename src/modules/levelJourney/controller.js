const { createUser } = require("../../models/user/utils");

const { findJourney, createJourney, updateJourney } = require("../../models/levelJourney/services")
const { createQuestionAttempt, findLatestQuestion, updateAttempt, findQuestionAttemptIds } = require("../../models/questionAttempts/services")
const { findQuestionIds, findQuestion } = require("../../models/questions/services")
const { findCorpus } = require("../../models/corpus/services")
exports.currentQuestion = async (req, res, next) => {
  try {
    //changed this to
    console.log(req.query.levelId, req.user._id)
    let journey = await findJourney({ userId: req.user.id, levelId: req.query.levelId, $or: [{ completed: { $exists: false } }, { completed: false }] })
    let journeyId = !journey ? await createUserJourney({ userId: req.user.id, levelId: req.query.levelId }) : journey._id
    let { currentStreak, maxStreak, totalXp, totalTime } = await findJourney({ _id: journeyId })
    let questionAttempt = await findLatestQuestion({ userId: req.user.id, levelId: req.query.levelId, journeyId })
    console.log(questionAttempt)

    if (!questionAttempt) return res.json({ messgae: "no question" })
    // serve question
    let { question, options, answer, questionType, attempted, correct, multiAnswers, multiQuestions, current, total } = questionAttempt
    res.json({ question: multiQuestions ? multiQuestions : question, options, answer: multiAnswers ? multiAnswers : answer, questionType, attempt: attempted ? true : false, status: correct, currentStreak: currentStreak > 4 ? 4 : currentStreak, maxStreak, totalTime, totalXp, current, total })
  }
  catch (Error) {
    console.log(Error)
    return res.send(501).json({ message: Error })
  }

}

exports.checkAnswer = async (req, res) => {
  try {
    let journey = await findJourney({ userId: req.user.id, levelId: req.query.levelId, $or: [{ completed: { $exists: false } }, { completed: false }] })
    console.log(journey)
    let journeyId = journey._id
    let questionAttempt = await findLatestQuestion({ userId: req.user.id, levelId: req.query.levelId, journeyId })
    console.log(questionAttempt)
    if (questionAttempt.attempted) return res.status(454).json({ attempt: "alredy attempted" })
    console.log(journey)
    let totalTime = req.body.timeTaken
    let correct = req.body.status
    let totalXp = 0
    // calculateXp(questionAttempt.questionId,totalTime)
    // return break up with total xp
    let attempted = await updateAttempt({ _id: questionAttempt._id }, { totalTime, totalXp, correct, attempted: true })
    if (attempted) {
      let { currentStreak, maxStreak } = correct ? await getStreak(journey.currentStreak, journey.maxStreak) : { currentStreak: 0, maxStreak: journey.maxStreak }
      let updatedJourney = await updateJourney({ _id: journeyId },
        { currentStreak, maxStreak, totalXp: journey.totalXp + totalXp, totalTime: journey.totalTime + totalTime })
      if (updatedJourney) {
        res.send({ success: true })
      }
    }

  }
  catch (Error) {
    console.log(Error)
    return res.status(501).json({ message: Error })

  }
}

exports.completeQuestion = async (req, res) => {
  try {
    let journey = await findJourney({ userId: req.user.id, levelId: req.query.levelId, $or: [{ completed: { $exists: false } }, { completed: false }] })
    console.log(journey)
    let journeyId = journey._id
    let questionAttempt = await findLatestQuestion({ userId: req.user.id, levelId: req.query.levelId, journeyId })
    console.log(questionAttempt.attempted,"hedcd")
    if (!questionAttempt.attempted) return res.status(454).json({ attempt: "not attempted" })
    let completed = await updateAttempt({ _id: questionAttempt._id }, { completed: true })
    if (completed) {

      let questionAttempt = await generateQuestionAttempt({ userId: req.user.id, levelId: req.query.levelId, journeyId })
      console.log(questionAttempt, "new attempt")
      if (!questionAttempt) {
        await updateJourney({ _id: journeyId }, { completed: true })
      }

      let { question, options, answer, questionType, attempted, correct, multiAnswers, multiQuestions, current, total } = questionAttempt
      res.json({
        question: multiQuestions && multiQuestions.length > 0 ? multiQuestions : question,
        options, answer: multiAnswers && multiAnswers.length > 0 ? multiAnswers : answer,
        questionType, attempt: attempted ? true : false, status: correct,
        currentStreak: journey.currentStreak > 4 ? 4 : journey.currentStreak,
        maxStreak: journey.maxStreak, totalTime: journey.totalTime,
        totalXp: journey.totalXp, current, total,
        completed : !questionAttempt ? true : false
      })


    }
  }
  catch (Error) {

  }

}
let createUserJourney = async (journeyData) => {

  try {
    console.log("creating journey", journeyData)
    let createdJourney = await createJourney({ ...journeyData })
    createdJourney ? await generateQuestionAttempt({ ...journeyData, journeyId: createdJourney._id }) : {}
    return createdJourney._id
  }
  catch (Error) {
    res.send(501).json({ message: Error })

  }
}

let generateQuestionAttempt = async (journeyData) => {
  try {
    let { questionId, current, total } = await pickRandomQuestion(journeyData)
    console.log(questionId, "here")
    let question = await findQuestion({ _id: questionId })
    if(!question) return 0
    let generatedQuestion = await generateQuestion(question)
    // ({
    //   ...journeyData,
    //   questionId,
    //   options: generatedQuestion.options,
    //   answer: question.questionType == 'match' ? generatedQuestion.multiAnswers : generated.answer,
    //   question: question.questionType == 'match' ? generatedQuestion.multiQuestions : generated.questions,
    //   questionType: question.questionType
    // })
    let questionObject = { ...journeyData, questionId, questionType: question.questionType, current, total }

    questionObject['multiQuestions'] = generatedQuestion.multiQuestions ? generatedQuestion.multiQuestions : null
    questionObject['multiAnswers'] = generatedQuestion.multiAnswers ? generatedQuestion.multiAnswers : null
    questionObject['question'] = generatedQuestion.questions
    questionObject['answer'] = generatedQuestion.answer
    questionObject['options'] = generatedQuestion.options
    console.log(questionObject, "qo")
    let createdQuestion = questionId ?
      await createQuestionAttempt
        ({ ...questionObject }) : null
    console.log(createdQuestion)
    return createdQuestion
  }
  catch (Error) {
    console.log(Error)
  }

}

let pickRandomQuestion = async ({ userId, levelId, journeyId }) => {
  try {
    console.log(userId, levelId, journeyId)

    let attempts = await findQuestionAttemptIds({ userId, levelId, journeyId })
    attempts = attempts.map((id) => String(id))
    let questionIds = await findQuestionIds({ levelId })
    let availableIds = questionIds.filter((id) =>
      attempts.indexOf(String(id)) == -1 ? true : false
    )
    console.log(attempts, questionIds, availableIds)
    return { questionId: availableIds[getRandomInt(0, availableIds.length - 1)], current: attempts.length + 1, total: questionIds.length }

  }
  catch (error) {
    console.log(error)
  }

}

let generateQuestion = async (question) => {
  console.log(question, "generateQuestion")
  let series = question.series
  let answer = question.answer[0]
  let island = question.island


  switch (question.questionType) {
    case 'mcqText':
      {
        let options = await getRandomOptions({ series, island, answer, count: 3 })
        let answerIndex = getRandomInt(0, options.length)

        options.splice(answerIndex, 0, answer)

        options.forEach((answer, index) => {
          let answerObj = {
            text: answer
          }
          options[index] = answerObj
        })
        let questions = {
          imageUrl: `${process.env.BASE_URL}assets/image/${series}/${island}/${answer}.png`,
          gifUrl: `${process.env.BASE_URL}assets/gif/${series}/${island}/${answer}.gif`
        }
        answer = answerIndex
        return { questions, options, answer }
        break;
      }
    case 'mcqGif': {
      let options = await getRandomOptions({ series, island, answer, count: 3 })
      let answerIndex = getRandomInt(0, options.length)
      options.splice(answerIndex, 0, answer)

      console.log(options)
      options.forEach((answer, index) => {
        let answerObj = {
          imageUrl: `${process.env.BASE_URL}assets/image/${series}/${island}/${answer}.png`,
          gifUrl: `${process.env.BASE_URL}assets/gif/${series}/${island}/${answer}.gif`
        }
        options[index] = answerObj
      })
      let questions = {
        text: answer
      }
      answer = answerIndex
      return { questions, options, answer }
    }
    case 'oddOneOut': {
      let options = question.options
      let answer = options.pop()
      let answerIndex = getRandomInt(0, options.length)
      options.splice(answerIndex, 0, answer)

      options.forEach((answer, index) => {
        let optionObj = {

          imageUrl: `${process.env.BASE_URL}assets/image/${series}/${island}/${answer}.png`,
          gifUrl: `${process.env.BASE_URL}assets/gif/${series}/${island}/${answer}.gif`

        }
        options[index] = optionObj
      })
      answer = answerIndex
      return { questions: "", options, answer }
    }
    case 'match': {
      let options = question.options
      shuffle(options)
      let multiQuestions = options
      options = Array(multiQuestions.length)
      let multiAnswers = []
      multiQuestions.forEach((value, index) => {

        let questionsObj = {
          imageUrl: `${process.env.BASE_URL}assets/image/${series}/${island}/${value}.png`,
          gifUrl: `${process.env.BASE_URL}assets/gif/${series}/${island}/${value}.gif`,
          text: value
        }
        let optionsObj = {
          text: value
        }
        let optionIndex = 0
        while (1) {
          optionIndex = getRandomInt(0, multiQuestions.length - 1)
          if (!options[optionIndex]) { break; }
        }



        options[optionIndex] = optionsObj
        multiQuestions[index] = questionsObj
        multiAnswers[index] = [index, optionIndex]
      })

      console.log("herez", multiAnswers, options)
      return { options, multiQuestions, multiAnswers }

    }
  }
}

let shuffle = (array) => {
  var currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}
let getStreak = async (currentStreak, maxStreak) => {

  currentStreak += 1
  maxStreak = currentStreak > maxStreak ? currentStreak : maxStreak

  return { currentStreak, maxStreak }
}
let getRandomOptions = async ({ series, island, answer, count }) => {

  answer = answer.split('_')

  let { corpusArray } = await findCorpus({ series, island })
  let corpus = []
  corpusArray.forEach((item) => {

    let { Corpus } = JSON.parse(JSON.stringify(item))
    Corpus.includes(answer[0]) ? {} : corpus.push(Corpus)

  })
  let numbers = nRandom(3, 0, corpus.length - 1)
  return [corpus[numbers[0]], corpus[numbers[1]], corpus[numbers[2]]]
}
let getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

let nRandom = (r, min, max) => {
  var numbers = []; // new empty array

  var min, max, r, n, p;

  for (let i = 0; i < r; i++) {
    do {
      n = Math.floor(Math.random() * (max - min + 1)) + min;
      p = numbers.includes(n);
      if (!p) {
        numbers.push(n);
      }
    }
    while (p);
  }

  return numbers
}