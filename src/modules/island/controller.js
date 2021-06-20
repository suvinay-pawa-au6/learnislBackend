const { createUser } = require("../../models/user/utils");
const { update, getIsland, create } = require("../../models/islands/services");
const { getSeries, createSeries } = require("../../models/series/services")
const { generateError } = require("../../utils/error");
const { generateAuthToken } = require("../../utils/general");

exports.islandsData = async (req, res, next) => {
  getIsland({}).then((data) => {
    console.log(data);
    res.json({ islandArray: data });
  });
};
exports.series = async (req, res, next) => {
  getSeries({}).then((data) => {
    console.log(data);
    res.json({ seriesArray: data });
  });
};
exports.createIsland = async (req, res, next) => {
  create({ ...req.body }).then((island) => {
    res.json(island);
  });
};
exports.createSeries = async (req, res, next) => {
  createSeries({ ...req.body }).then((island) => {
    res.json(island);
  });
};


exports.getIslandStatus = (req, res, next) =>
  getIsland(req.user)
    .then((user) => res.send({ status: user.status, otp: user.otp }))
    .catch((error) => {
      res.status(500).send("user cannot be accessed");
    });

exports.getIslandUser = async (req, res) =>
  getIsland({ phone: req.query.phone }).then((user) =>
    user._id ? res.send(user) : res.send("User not found")
  );
