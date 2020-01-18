const mongoose = require("mongoose");

const URI =
  "mongodb+srv://dbGraph1:FirstGraphProject1@cluster0-vwgnt.mongodb.net/test?retryWrites=true&w=majority";

const connectDB = async () => {
  await mongoose.connect(URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });
  console.log("db connected ..!");
};

module.exports = connectDB;
