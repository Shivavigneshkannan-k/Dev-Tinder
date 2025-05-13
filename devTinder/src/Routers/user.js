const express = require("express");
const userRouter = express.Router();
const requestConnection = require("../models/connection");
const { userAuth } = require("../utils/auth");
const User = require("../models/user");

const allowedField = "firstName lastName age gender about skills";

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const requestReceived = await requestConnection
      .find({
        toUserId: loggedUser._id,
        status: "interested"
      })
      .populate("fromUserId", allowedField);

    const data = requestReceived.map((key) => key.fromUserId);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: "error :" + err });
  }
});

userRouter.get("/user/connection", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const connection = await requestConnection
      .find({
        $or: [
          { fromUserId: loggedUser._id, status: "accepted" },
          { toUserId: loggedUser._id, status: "accepted" }
        ]
      })
      .populate("fromUserId", allowedField)
      .populate("toUserId", allowedField);

    const data = connection.map((con) => {
      if (loggedUser._id.equals(con.fromUserId._id)) {
        return con.toUserId;
      }
      return con.fromUserId;
    });
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: "error :" + err });
  }
});
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 25 ? 25 : limit;
    const skip = (page - 1) * limit;
    const loggedUser = req.user;
    const connections = await requestConnection
      .find({
        $or: [{ toUserId: loggedUser._id }, { fromUserId: loggedUser._id }]
      })
      .select("fromUserId toUserId");

    const hideUserSet = new Set();
    connections.forEach((con) => {
      hideUserSet.add(con.fromUserId.toString());
      hideUserSet.add(con.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: [...hideUserSet] } },
        { _id: { $ne: loggedUser._id } }
      ]
    })
      .select(allowedField)
      .skip(skip)
      .limit(limit);
    res.json({ data: users, count: users.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = userRouter;
