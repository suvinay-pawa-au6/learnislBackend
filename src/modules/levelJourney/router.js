const { Router } = require("express");
const {
    currentQuestion , checkAnswer , completeQuestion
} = require("./controller");
const { withAuthUser } = require("../../middlewares/auth");
const { validate } = require("../../middlewares/schema");
// const { response } = require('../../middlewares/response')


const dashboardRouter = Router();

dashboardRouter.get("/currentQuestion", withAuthUser, currentQuestion)
dashboardRouter.post("/checkAnswer", withAuthUser, checkAnswer)
dashboardRouter.post("/continue",withAuthUser, completeQuestion)
module.exports = dashboardRouter;
