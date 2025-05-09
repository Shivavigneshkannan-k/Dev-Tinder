const express = require("express");
const router = express.Router();
const requestConnection = require("../models/connection")
const User = require("../models/user");
const {userAuth} = require("../utils/auth");

router.use(userAuth);

router.post("/request/send/:status/:toUserId",async (req,res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params?.toUserId;
        const status = req.params?.status;
        
        // existing request check
        const isRequestExist = await requestConnection.findOne({
            $or: [
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
        }) 
        if(isRequestExist){
            throw new Error("Request Already exist");
        }
        //INVALID status check
        const ALLOWED_STATUS = ["interested","ignored"];
        if(!(ALLOWED_STATUS.includes(status))){
            throw new Error("Invalid status type: "+ status);
        }

        // user not found check
        const toUser = await User.findById({_id:toUserId});
        if(!toUser){
            throw new Error("User Not found");
        }

        const newConnection = new requestConnection({
            fromUserId,toUserId,status
        })
        await newConnection.save();
        res.json({message:"request sent successfully",data:newConnection})
    }
    catch(err){
        res.status(400).json({message:"error :"+err})
    }
});

module.exports = router;