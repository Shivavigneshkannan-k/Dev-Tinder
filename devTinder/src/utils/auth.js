const {isStrongPassword,isEmail} = require("validator")
const dotenv = require("dotenv");
dotenv.config();
const User = require("../models/user")
const jwt = require("jsonwebtoken");

const validateAuth =(obj)=>{
    const {firstName,password,emailId,age} = obj;
    if(!firstName || !password || !emailId){
        throw new Error("fields can't be empty!");
    }
    else if(!isEmail(emailId)){
        throw new Error("Invalid Email ID!")
    }
    else if(!isStrongPassword(password)){
        throw new Error("weak password!");
    }
    else if(age<18){
        throw new Error("below age 18 not allowed!")
    }
}
const userAuth = async (req,res,next)=>{
    try{
        const token = req.cookies?.token;
        if(!token){
            throw new Error("invalid token");
        }
        const data = jwt.verify(token,process.env.JWT_KEY);
        const userId = data?._id;
        const user = await User.findById(userId);
        if(!user){
            throw new Error("User Not found");
        }
        req.user = user;
        next();
    }
    catch(err){
        res.status(400).send("Invalid Credientals "+ err);
    }
}
module.exports = {validateAuth,userAuth};