const { generateError } = require("../../utils/error");
const Organization = require(".");

exports.getOrganizations = async (query) =>
  Organization.find({ ...query })
    .then((response) => response)
    .catch((error) => console.log(error));

exports.createOrganization = (OrganizationData) =>
  Organization.create({ ...OrganizationData, createdAt: new Date() })
    .then((response) => response)
    .catch((error) => {
      console.error(error)
    });
exports.updateOrganizationArray = async (queryObject, classCode) =>
  Organization.updateOne(queryObject, { $push: { classCodes: classCode } })
    .then((res) => (res && res.n ? true : generateError()))
    .catch((error) => {
      console.log(error);
      return error;

    });

exports.updateOrganizationUserArray = async (queryObject, userId) =>
  Organization.updateOne(queryObject, { $push: { users: userId } })
    .then((res) => (res && res.n ? true : generateError()))
    .catch((error) => {
      console.log(error);
      return error;

    });

exports.findOrganizations = (query) =>
  Organization.find({ createdBy: query.createdBy })
    .then((response) => response)
    .catch((error) => {
      throw Error(error);
    });

exports.updateOrganization = (queryObject, updateObject) =>
  Organization.findOneAndUpdate(queryObject, updateObject)
    .then((response) => response)
    .catch((error) => {
      console.log(error);
      throw Error(error);
    });
exports.exist = (phone) =>
  Organization.findOne({ phone: phone })
    .then((Organization) => (!Organization ? false : true))
    .catch((err) => false);

exports.getOrganization = async (query) =>
  Organization.findOne({ _id: query.id })
    .then((response) => (response ? response : generateError()))
    .catch((error) => error);

exports.deleteOrganization = async (mobile) =>
  Organization.deleteOne({ phone: mobile })
    .then((response) => (response ? response : null))
    .catch((error) => error);
//created At
//ExpiryTime
//new Date().getTime() + (3* 60 * 1000)
//phone:OrganizationData.phone,createdAt:new Date()
