const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("Kindly login first...!");
    }

    const decoded = jwt.verify(token, "SECRET_KEY");

    const user = await User.findById(decoded._id);

    if (!user) {
      throw new Error("User not found...!");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("ERROR:" + error);
  }
};

module.exports = userAuth;
