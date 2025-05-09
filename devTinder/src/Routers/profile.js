const express = require("express");
const profileRouter = express.Router();
const { userAuth, validatePassword } = require("../utils/auth");
const bcrypt = require("bcrypt");
const validator = require("validator");

profileRouter.use(userAuth);

profileRouter.get("/profile/view", async (req,res)=>{
    try{
    res.json(req.user);
  }
  catch(err){
    res.status(400).json({message: "fetch failed "+err});
  }
})

profileRouter.patch("/profile/edit/password",async (req,res)=>{
    try{
        validatePassword(req);
        const newPasswordHash = await bcrypt.hash(req.body.newPassword_1,10);
        const loggedUser = req.user;
        loggedUser.password = newPasswordHash;
        await loggedUser.save();
        res.json({message: "password updated successfully"});
    }
    catch(err){
        res.status(400).json({message: "password update error "+err});
    }
    
})

profileRouter.patch("/profile/edit",async (req,res)=>{
    try{
        
        console.log(req.user)
        const ALLOWED_UPDATES = ["firstName","lastName","age","gender","about","skill","photoPath"];
        const isAllowed = Object.keys(req.body).every(key => ALLOWED_UPDATES.includes(key));
        if(!isAllowed){
            throw new Error("Invalid update");
        }
        const loggedUser = req.user
        Object.keys(req.body).every(key=>loggedUser[key]=req.body[key]);
        await loggedUser.save();
        
        res.json({message: "updated successfully" })
    }
    catch(err){
        res.status(400).json({message: "update failed "+err});
    }
})



module.exports = profileRouter;