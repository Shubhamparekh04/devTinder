const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateSignupData } = require("../utils/validation");
const userAuth = require("../middleware/auth");
const validator = require("validator");
const authRouter = express.Router();

//signup
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    const savedUser = await user.save();
    let token = await savedUser.getJWT();
    res.cookie("token", token);
    res.status(201).json({ message: "Data added...!", data: savedUser });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

//login
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    let user = await User.findOne({ emailId });

    if (!user) {
      throw new Error("Invalid Credentials...!");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error("Invalid Credentials");
    } else {
      //create JWT token
      // let token = jwt.sign({ _id: user._id }, "SECRET_KEY");
      let token = await user.getJWT();

      //send token to client
      res.cookie("token", token);
      res.status(200).send(user);
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

//logout
authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout success...!");
});

// reset profile password
authRouter.patch("/resetPassword", userAuth, async (req, res) => {
  try {
    const { password } = req.body;

    if (!validator.isStrongPassword(password)) {
      throw new Error("Please select strong password...!");
    }

    let passwordHash = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(req.user._id, {
      password: passwordHash,
    });

    res.send("reset password done");
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

module.exports = authRouter;
