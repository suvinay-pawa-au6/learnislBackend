const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
// mongodb://localhost:27017/server
const connectToDB = () =>
    mongoose.connect("mongodb+srv://usermongo:abcd1234@cluster0.sfyzu.mongodb.net/signtalktest", {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
    })
        .then(() => console.log("connected to mongodb"))
        .catch(console.error);

module.exports = connectToDB
