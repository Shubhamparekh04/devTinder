const express = require("express");
const userAuth = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      if (fromUserId.equals(toUserId)) {
        throw new Error("User can't send request to it self...! ");
      }

      const isAllowedStatus = ["ignored", "interested"];

      if (!isAllowedStatus.includes(status)) {
        throw new Error("Invalid status...!");
      }

      let toUser = await User.findById(toUserId);

      if (!toUser) {
        throw new Error("User not found...!");
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        throw new Error("Connection request already existed...!");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      // ConnectionRequest.index({ fromUserId: 1, toUserId: 1 });

      await connectionRequest.save();
      res.status(200).json({
        message: `${req.user.firstName} has ${
          status == "interested" ? "Shown intrest in" : "ignored"
        } ${toUser.firstName}'s profile`,
        data: connectionRequest,
      });
    } catch (error) {
      res.status(400).send("ERROR:" + error.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInId = req.user._id;

      const { status, requestId } = req.params;

      const isAllowedStatus = ["accepted", "rejected"];

      if (!isAllowedStatus.includes(status)) {
        throw new Error("Invalid status...!");
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInId,
        status: "interested",
      });

      if (!connectionRequest) {
        throw new Error("Connection request not found...!");
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.status(200).json({ message: "Connection request", data });
    } catch (error) {
      res.status(400).send("ERROR: " + error.message);
    }
  }
);

module.exports = requestRouter;
