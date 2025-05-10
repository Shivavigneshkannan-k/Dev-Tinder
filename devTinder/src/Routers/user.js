const express = require("express");
const userRouter = express.Router();
const requestConnection = require("../models/connection");
const { userAuth } = require("../utils/auth");

const allowedField = "firstName lastName age gender about skill";

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const requestReceived = await requestConnection.find({
      toUserId: loggedUser._id,
      status: "interested"
    }).populate("fromUserId",allowedField);

    const data = requestReceived.map(key => key.fromUserId);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: "error :" + err });
  }
});

userRouter.get("/user/connection",userAuth,async (req,res)=>{
    try{
        const loggedUser = req.user;
        const connection = await requestConnection.find({
            $or:[
                {fromUserId: loggedUser._id,status: "accepted"},
                {toUserId : loggedUser._id,status: "accepted"}
            ]
        }).populate("fromUserId",allowedField).populate("toUserId",allowedField);


        const data = connection.map(con => {
            if(loggedUser._id.equals(con.fromUserId._id)){
                return con.toUserId;
            }
            return con.fromUserId;
        })
        res.json(data);
    } catch (err) {
        res.status(400).json({ message: "error :" + err });
    }
})

module.exports = userRouter;
