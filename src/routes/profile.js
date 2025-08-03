const express = require("express");
const userAuth = require("../middleware/auth");
const { validateProfileEditData } = require("../utils/validation");
const profileRouter = express.Router();

//view profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    let user = req.user;

    if (!user) {
      throw new Error("User not found...!");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR:" + error);
  }
});

//edit profile
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;
    console.log(loggedInUser);

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    console.log(loggedInUser);

    // await loggedInUser.validate();
    const user = await loggedInUser.save();
 
    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully!`,
      data: user,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = profileRouter;
