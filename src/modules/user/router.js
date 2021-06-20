const { Router } = require("express");
const {
  register,
  setUsertype,
  getStatus,
  setOrganization,
  requestpass,
  resetpass,
  login,
  resendOtp,
  dashboard,
  islandData,
  createOrganization,
  addClassCode,
  getOrg,
  getProfile,
  getTrack
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

const userRouter = Router();

userRouter.post("/register", register);
userRouter.post("/usertype", withAuthUser, setUsertype);
userRouter.post("/organization", withAuthUser, setOrganization);
userRouter.post("/otp",resendOtp)
userRouter.post("/resetpass", requestpass);
userRouter.patch("/resetpass",withAuthUser, resetpass);
userRouter.get("/dashboard",withAuthUser, dashboard);
userRouter.get("/islandData/:id",withAuthUser,islandData)
userRouter.post("/login", login);
userRouter.get("/createOrg",createOrganization)
userRouter.get("/addClasscode",addClassCode)
userRouter.get("/org",getOrg)
userRouter.get("/profile",withAuthUser,getProfile)
userRouter.get("/track",withAuthUser,getTrack)

module.exports = userRouter;
