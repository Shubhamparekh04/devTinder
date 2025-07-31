const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://nodeDev:3Hzo6sdA9n3zQXLT@cluster0.gxjuteu.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
