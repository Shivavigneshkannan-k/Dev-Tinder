const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const { dbConnect } = require("./utils/dbConnection");
const User = require("./models/user");
const { validateAuth, userAuth } = require("./utils/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    validateAuth(req.body);
    const { firstName, lastName, age, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      age,
      emailId,
      password: passwordHash
    });

    await newUser.save();
    res.send("User signed up successfully ");
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
});

app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    if (!emailId || !password) {
      throw new Error("Invalid Credientials");
    }
    const user = await User.findOne({ emailId: emailId });
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const token = await user.jwtToken();
    res.cookie("token",token,{expires: new Date(Date.now() + 900000)});
    res.send("Logged In successfully");


  } catch (err) {
    res.status(401).send("Invalid Credientials");
  }
});


app.get("/profile",userAuth, async (req,res)=>{
  
  try{
    res.send(req.user);
  }
  catch(err){
    res.status(400).send("Verification failed!!!" + err)
  }
  
})
app.get("/sendConnectionRequest",userAuth,(req,res)=>{
  try{
    res.send("sending connection request...");
  }
  catch(err){
    res.status(400).send("Error " +err);
  }
})


app.get("/user", async (req, res) => {
  try {
    const userData = await User.find();
    res.send(userData);
  } catch (err) {
    res.status(404).send("Error: " + err);
  }
});

app.patch("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, age, skill, about, gender } = req.body;
    if (skill && skill.length > 10 && skill.length < 2) {
      throw new Error("Invaild Entry of Skills");
    }
    const data = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, age, skill, about, gender },
      { runValidators: true }
    );
    res.send("updated successfully");
  } catch (err) {
    res.status(404).send("Error" + err);
  }
});

app.delete("/user", async (req, res) => {
  try {
    const userId = req.body._id;
    await User.findByIdAndDelete(userId);
    res.send("deleted successfully");
  } catch (err) {
    res.status(404).send("Error" + err);
  }
});

app.use("/", (req, res) => {
  res.send("unHandled Response");
});

dbConnect()
  .then(() => {
    console.log("DB connection established!!!");
    app.listen(PORT, () => console.log(`server is listening on port ${PORT}`));
  })
  .catch(() => console.error("DB connection failed!!!"));
