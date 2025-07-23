const express = require("express");
const app = express();


app.use("/test",(req,res)=>{
    res.send("Test");
})

app.use("/",(req,res)=>{
    res.send("Dashboard");
})




app.listen(3000,()=>{
    console.log("Server running on 3000 port...!!!");
})