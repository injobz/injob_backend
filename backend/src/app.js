const express = require("express");
const connectdb=require("../config/dbconnect");
const authRoute = require("../routes/authRoute");

const app = express();
app.use(express.json());

connectdb()
.then(()=>{
    console.log("Database is ready ");
    app.listen(7777,(req,res)=>{
        console.log("server is running on 7777");
    })
})
.catch((err)=>{
    console.log("some issue occured :"+err.message);
})
app.post("/auth",authRoute);

app.get("/",(req,res)=>{
    res.send("This is injob server");
});


