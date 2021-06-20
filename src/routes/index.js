const { Router } = require("express");

const userRouter = require("../modules/user/router.js");
const islandRouter = require("../modules/island/router.js");
const cmsRouter = require("../modules/cms/router.js")
const levelJourneyRouter = require("../modules/levelJourney/router.js")
const router = Router();


router.get("/", (_, res) => res.send());
router.use("/user", userRouter);
router.use("/dashboard", islandRouter)
router.use("/cms", cmsRouter);
router.use("/level", levelJourneyRouter)


module.exports = router;
