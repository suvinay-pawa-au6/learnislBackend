const { Router } = require("express");
const {
 islandsData,createIsland,series,createSeries
} = require("./controller");
const { withAuthUser } = require("../../middlewares/auth");
const { validate } = require("../../middlewares/schema");
// const { response } = require('../../middlewares/response')
const {
  registerUserContract,
  addAddressContract,
  editAddressContract,
  editUserContract,
} = require("./contract");

const dashboardRouter = Router();

dashboardRouter.get("/islands", islandsData)
dashboardRouter.get("/series",series)
dashboardRouter.post("/createSeries",createSeries)
dashboardRouter.post("/createIsland",createIsland)
module.exports = dashboardRouter;
