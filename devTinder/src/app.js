const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const { dbConnect } = require("./utils/dbConnection");
const authRouter = require("./Routers/auth");
const profileRouter = require("./Routers/profile");
const requestRouter = require("./Routers/request");
const userRouter = require("./Routers/user");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/',userRouter);



app.use("/", (req, res) => {
  res.send("unHandled Response");
});

dbConnect()
  .then(() => {
    console.log("DB connection established!!!");
    app.listen(PORT, () => console.log(`server is listening on port ${PORT}`));
  })
  .catch(() => console.error("DB connection failed!!!"));
