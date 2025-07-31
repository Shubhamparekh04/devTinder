const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 10,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invallid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 10,
      maxLength: 100,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter strong password: " + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      lowercase: true,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender data not valid...!");
        }
      },
    },
    skills: {
      type: [String],
    },
    about: {
      type: String,
      default: "This is default about...!",
    },
    photoUrl: {
      type: String,
      default:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vhv.rs%2Fviewpic%2FioJThwo_men-profile-icon-png-image-free-download-searchpng%2F&psig=AOvVaw273v1nuuFzzGHE-EZ9_mDK&ust=1753539590113000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCPC-rZSa2I4DFQAAAAAdAAAAABAE",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL:" + value);
        }
      },
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: this._id }, "SECRET_KEY");
  return token;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
