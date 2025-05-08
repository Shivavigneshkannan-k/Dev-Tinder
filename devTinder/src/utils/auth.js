const {isStrongPassword,isEmail} = require("validator")
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
module.exports = {validateAuth};