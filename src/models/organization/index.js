const mongoose = require("mongoose");
const organizationSchema = require("./schema")

const Organization = mongoose.model("organization", organizationSchema);

module.exports = Organization;