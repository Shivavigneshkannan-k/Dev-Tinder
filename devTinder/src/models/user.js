const mongoose = require("mongoose");
const { isEmail } = require("validator");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserModel = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minLength: 3,
      maxLength: 50,
      trim: true,
      required: true
    },
    lastName: {
      type: String,
      maxLength: 50,
      trim: true
    },
    emailId: {
      type: String,
      validate: (value) => {
        if (!isEmail(value)) {
          throw new Error("invalid Email Id");
        }
      },
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
      index: true
    },
    password: {
      type: String,
      trim: true,
      required: true
    },
    age: {
      type: Number,
      min: 18
    },
    gender: {
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("invalid gender");
        }
      },
      type: String,
      trim: true,
    },
    skills: {
      type: [String]
    },
    about: {
      type: String,
      trim: true
    },
    photoPath: {
      type: String,
      trim: true,
      default:
        "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg?semt=ais_hybrid&w=740"
    }
  },
  { timestamps: true }
);
UserModel.methods.jwtToken = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_KEY, {
    expiresIn: "1h"
  });
  return token;
};
UserModel.methods.validatePassword = async function (InputPassword) {
  const user = this;
  const passwordHash = user.password;
  const isValidPassword = await bcrypt.compare(InputPassword, passwordHash);
  return isValidPassword;
};
const User = mongoose.model("User", UserModel);
module.exports = User;
