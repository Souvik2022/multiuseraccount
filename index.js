const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/user_management");

const express = require("express");
const app = express();

//for user routes
const userRoute = require("./routes/userroute")
app.use('/' , userRoute);

app.listen(3000 , function () {
    console.log("server is running");
})
