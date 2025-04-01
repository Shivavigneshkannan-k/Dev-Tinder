const express = require("express");
const app = express();

app.use("/hi",(req,res)=> {
    res.send("hi from express");
})
app.use("/",(req,res)=> {
    res.send("hello from express");
})
app.listen(3000);