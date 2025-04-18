require("dotenv").config();
const express = require("express");
const connectdb=require("../config/dbconnect");
const authRouter = require("../routes/authRoute");
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.use("/auth",authRouter);
connectdb()
.then(()=>{
    console.log("Database is ready ");
    app.listen(PORT,(req,res)=>{
        console.log(`Server is running on ${PORT}`);
    })
})
.catch((err)=>{
    console.log("some issue occured :"+err.message);
})





