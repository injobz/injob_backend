require('dotenv').config();
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const authUser=require("../middleware/auth");

const authRouter = express.Router();

//SignUp Route
authRouter.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, emailId, password } = req.body;

        if (!firstName || !lastName || !emailId || !password) {
            return res.status(400).json({ error: "All fields are required." });
        }
        const existingUser = await User.findOne({ emailId });
        if (existingUser) {
            return res.status(409).json({ error: "Email is already in use." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the user
        const newUser = new User({
            firstName,
            lastName,
            emailId,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error("Error during user registration:", error.message);
        res.status(500).json({ error: "An error occurred while registering the user." });
    }
});
//LogiIn Route
authRouter.post("/login",async(req,res)=>{
    try{
        const{ emailId,password}=req.body;
        if(!emailId || !password){
            return res.status(400).send("All fields are required.");
        }
        const user = await User.findOne({emailId});
        if(!user){
            return res.status(404).send("User not found");
        }
        const  isPassValid=await user.isPassValid(password);
        if(!isPassValid){
            return res.status(401).send("Invalid credentials");
        }
        const token = user.getJWT();
        res.cookie('token',token);
        res.status(200).send("Login Suceesfull");
    }catch(err){
        res.status(500).send("Interval server Error"+err.message);
    }
});
//LogOut API
authRouter.post('./logout'),authUser,async(req,res)=>{
    res.clearCookie('token');
    res.send("Logout Successfull");
}

module.exports = authRouter;
