const express = require("express");
const authRouter = express.Router();

const bcrypt = require("bcrypt");
const { validateAuth, userAuth } = require("../utils/auth");
const User = require("../models/user");

authRouter.post("/signup",validateAuth, async (req, res) => {
  try {
    
    const { firstName, lastName, age, emailId, password,skills,gender } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      age,
      emailId,
      password: passwordHash,
      skills,
      gender
    });

    await newUser.save();
    res.json({ message: "User signed up successfully " });
  } catch (err) {
    res.status(400).json({ message: "Error: " + err });
  }
});

authRouter.post("/login", async (req, res) => {
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
    res
      .cookie("token", token, { expires: new Date(Date.now() + (3600*1000)) })
      .json({ message: "Logged In successfully " , data: user});
    } catch (err) {
      res.status(401).json({ message: "Invalid Credientials" });
  }
});

authRouter.post("/logout",(req, res) => {
  res.cookie("token", null, { expires: 0 });
  res.json({ message: "logged out successfully!!!" });
});

module.exports = authRouter;
