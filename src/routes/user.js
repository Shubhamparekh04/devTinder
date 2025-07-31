const express = require("express");
const userAuth = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName age skills about gender photoUrl";

//get all pending request for logged in user
userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUserId,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    if (!connectionRequest) {
      throw new Error("Requests not found...!");
    }

    res.status(200).json({
      message: "Connection requests found...!",
      data: connectionRequest,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

//Get all friend list
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    if (!connectionRequest) {
      throw new Error("No friends");
    }

    const filteredConnections = connectionRequest.map((obj) => {
      if (obj.fromUserId._id.equals(loggedInUser._id)) {
        return obj.toUserId;
      } else {
        return obj.fromUserId;
      }
    });

    console.log(filteredConnections);

    res.status(200).json({
      message: "Friends found...!",
      data: filteredConnections,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

//feed
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    let skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();

    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    let users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res
      .status(200)
      .json({ message: "feed fatched successfully...!", data: users });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = userRouter;
