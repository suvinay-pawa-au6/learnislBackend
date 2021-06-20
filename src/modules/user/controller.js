const { createUser } = require("../../models/user/utils");
const {
  update,
  get,
  create,
  findUsers,
  deleteUser,
} = require("../../models/user/services");
const { createOrganization, updateOrganizationArray, updateOrganization, getOrganizations } = require("../../models/organization/services")
const { getIsland } = require("../../models/islands/services")
const { generateError } = require("../../utils/error");
const { generateAuthToken } = require("../../utils/general");
const { generateOtp, sendMail } = require("../user/util");

exports.register = async (req, res, next) => {
  let otp = generateOtp();
  let status = req.body.socialLogin ? "1b" : "1a";
  otp = status == "1a" ? otp : null;
  create({ ...req.body, status: status, otp: otp })
    .then((user) => {
      user.keyValue
        ? user.keyValue.email
          ? generateError("email")
          : generateError("username")
        : console.log("Both unique");
      if (user.status == "1b") {
        res.send({
          message: "User successfuly registered",
          status: status,
          token: generateAuthToken(user._id),
        });
      } else if (user.status == "1a") {
        sendMail(otp, req.body.email);
        // send otp to email
        res.send({
          message: "Otp sent successfuly for succesfully registered user",
          status: status,
          token: generateAuthToken(user._id),
        });
      }
    })
    .catch((err) => {
      let statuscode = err.message == "email" ? 452 : 453;
      res.status(statuscode).send({ message: `${err.message} Already exists` });
    });
};


exports.islandData = async (req, res, next) => {
  getIsland({ id: req.params.id }).then((data) => {
    console.log(data)
    res.json({ levelArray: data[0].levels, medals: 0 })
  })
}
exports.setUsertype = (req, res, next) => {
  get(req.user)
    .then((user) => {
      if (user.otp) {
        if (req.body.otp != user.otp) {
          return res.status(454).send({ message: "Otp doesnt match" });
        }
      }
      if (req.body.userType == 1) {
        user.status = "3";
        user.userType = "general";
      } else {
        user.status = "2a";
        user.userType = "corporate";
      }
      user.signlanguage = req.body.signlanguage;
      let status = user.status;
      console.log(user);
      update({ _id: user._id }, user)
        .then((user) =>
          res.send({ status: status, message: "userType set succesfully" })
        )
        .catch((error) => {
          res.status(500).send(error.message);
        });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.setOrganization = async (req, res, next) => {
  get(req.user)
    .then(async (user) => {
      let organization = await getOrganizations({ organizationCode: req.body.organizationCode })
      let team = await getOrganizations({ classCodes: { $in: [req.body.classCode] }, organizationCode: req.body.organizationCode })
      console.log(organization, team)
      if (!organization[0]) generateError(456)
      if (organization[0] && !team[0]) generateError(457)
      if (team[0].count < 1) generateError(458)

      if (user.status == "2a") {
        user.organizationCode = req.body.organizationCode;
        user.classCode = req.body.classCode;
        user.status = "3";
        update(
          { _id: user._id },
          {
            ...user,
          }
        )
          .then((user) => {
            console.log(user)
            let updatedOrganization = updateOrganization({ organizationCode: req.body.organizationCode }, { $inc: { 'count': -1 } })

            res.send({
              status: "3",
              message: "user Organization set succesfully",
            })
          })
          .catch((error) => {
            res.status(error.message).send(error.message);
          });
      } else {
        res.status(500).send({ message: "User STATUS is not 2a" });
      }
    })
    .catch((error) => {
      res.status(error.message).send(error.message);
    });
};

exports.dashboard = (req, res, next) =>
  get(req.user)
    .then((user) => {
      streak = user.streak ? user.streak : 0
      points = user.points ? user.points : 0
      currentIsland = user.currentIsland ? user.currentIsland : "60603072df4e9a57dcedcd8d"
      res.json({ streak, points, currentIsland })
    })
    .catch((error) => {
      res.status(500).send("user cannot be accessed");
    });
exports.getProfile = (req, res, next) =>
  get(req.user)
    .then((user) => {

      res.json({ name: user.name, username: user.username, coin: 0, streak: 0, biscuit: 0, performingTopics: [], laggingTopics: [], vault: [] })
    })
    .catch((error) => {
      res.status(500).send("user cannot be accessed");
    });

exports.getTrack = (req, res, next) =>
  get(req.user)
    .then((user) => {
      res.json({ trackRecord: [] })
    })
    .catch((error) => {
      res.status(500).send("user cannot be accessed");
    });
exports.resendOtp = (req, res, next) => {
  console.log(req.body)
  get({ email: req.body.email })
    .then((user) => sendMail(user.otp, user.email))
    .then((result) => res.send(result))
    .catch((error) => {
      res.status(500).send("user cannot be accessed");
    });
}
exports.requestpass = (req, res, next) => {
  let query = {};
  query.username = req.body.username;
  query.email = req.body.email;
  get({ ...query })
    .then((user) => {
      console.log(user);
      user.message
        ? generateError(user.message)
        : sendMail(0, user.email, generateAuthToken(user._id));
    })
    .then((result) => res.send(result))
    .catch((error) => {
      let statuscode =
        error.message === "notASocialUser"
          ? 455
          : error.message === "incorrectPassword"
            ? 461
            : error.message === "invalidEmail"
              ? 459
              : error.message === "invalidUsername"
                ? 460
                : 500;
      res.status(statuscode).send({ error: error.message });
    });
};
exports.resetpass = (req, res, next) => {
  console.log("HI");
  get({ email: req.user.email })
    .then((user) =>
      user.socialLogin
        ? generateError("notForSocial")
        : update(
          { _id: user._id },
          {
            password: req.body.password,
          }
        )
    )
    .then((user) =>
      user.n
        ? res.send("Password Reset Succesfully")
        : generateError("Unable to reset Password")
    )
    .catch((err) => {
      console.log(err.message);
      let statuscode = err.message == "notForSocial" ? 462 : 500;
      res.status(statuscode).send({ message: `${err.message} Already exists` });
    });
};

exports.login = (req, res, next) => {
  let query = {};
  query.username = req.body.username;
  query.email = req.body.email;
  console.log(query);

  get({ ...query })
    .then((user) => {
      console.log("user", user);
      if (!req.body.socialLogin) {
        user.message ? generateError(user.message) : user;

      }
      if (user._id) {
        if (user.socialLogin == true) {
          if (req.body.password) generateError('invalidEmail')
          console.log("humanize");
          return res.send({
            message: "Login successful",
            token: generateAuthToken(user._id),
            status: user.status,
          });
        }
        if (req.body.socialLogin) generateError("notASocialUser");

        console.log("hi", user.password);
        if (user.password === req.body.password) {
          console.log("yess");
          return res.send({
            message: "Login successful",
            token: generateAuthToken(user._id),
            status: user.status,
          });
        } else {
          console.log("hilksa;k;ds");
          generateError("incorrectPassword");
        }
      } else if (req.body.socialLogin == true && !user._id) {
        let status = "1b";
        console.log("hiiii");
        console.log(req.body, status);
        create({ ...req.body, status: status })
          .then((user) => {
            if (user.status == "1b") {
              res.send({
                message: "User successfuly registered",
                status: status,
                token: generateAuthToken(user._id),
              });
            }
          })
          .catch((error) => {
            console.log("xckckx;lkcx", error);
            let statuscode =
              error.message === "notASocialUser"
                ? 455
                : error.message === "incorrectPassword"
                  ? 461
                  : error.message === "invalidEmail"
                    ? 459
                    : error.message === "invalidUsername"
                      ? 460
                      : 500;

            res.status(statuscode).send({ error: error.message });
          });
      }
    })
    .catch((error) => {
      let statuscode =
        error.message === "notASocialUser"
          ? 455
          : error.message === "incorrectPassword"
            ? 461
            : error.message === "invalidEmail"
              ? 459
              : error.message === "invalidUsername"
                ? 460
                : 500;
      res.status(statuscode).send({ error: error.message });
    });
};

exports.createOrganization = async (req, res) => {
  try {
    console.log(req.query)
    let organization = await createOrganization({ organizationCode: req.query.organizationCode, count: req.query.count })
    res.status(200).send("Created ORGANIZATION", organization)
  }
  catch (err) {
    res.status(200).send("Already exists")
  }
}

exports.addClassCode = async (req, res) => {

  console.log(req.query)
  let organization = await updateOrganizationArray({ organizationCode: req.query.organizationCode }, req.query.classCode)
  res.status(200).json({ "Updated ORGANIZATION": organization })
}

exports.getOrg = async (req, res) => {
  res.status(200).json({ "Updated ORGANIZATION": await getOrganizations({}) })
}