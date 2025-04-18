require("dotenv").config();

const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const authUser=async(req,res,next)=>{
    try{
        const cookies = req.cookies;
        const {token}=cookies;
        if(!token){
            return res.status(401).send("Unauthorized User");
        }
        const decoded = await jwt.verify(token,process.env.JWT_SECRET_KEY);
        const{_id}=decoded;
        const user = await User.findById(_id);
        if(!user){
            return res.status(404).send("Unauthorized User");
        }
         req.user=user
         next();
    }catch(err){
        res.status(500).send("Internal Server Error :"+err.message);
    }

};
module.exports= authUser;
