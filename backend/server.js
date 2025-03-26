const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken');
const User = require('./models/user');
const connectToDB = require('./utills/db');
require('dotenv').config(); // Import and configure dotenv
const cors = require('cors');
const cookieParser = require('cookie-parser');
const JWT_SECRET = "test1234";
//middlewares
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    credentials:true,
    domain:'http://localhost:3000'
}));
app.use(bodyParser.json());
connectToDB()
    .then(() => {
        const PORT = 5000;
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to the database:', err);
    });
// API to register a user
app.post('/api/register', async (req, res) => {
    try {
        const { username,email,password,age,gender} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username,email, password: hashedPassword,age,gender });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' ,error});
    }
});
// API to login a user
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token);
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
});
//API to get user details
app.get('/api/user',async(req,res)=>{
    try{
        const token = req.cookies.token;
        const payload = jwt.verify(token,JWT_SECRET);
        if(!payload) return res.status(401).json({error:'You need to be logged in'});
        else{
            const user = await User.findById(payload.id).select('-password');
            res.status(200).json(user);
        }

    }catch(error){
        res.status(500).json({error: 'Error fetching details'});
    }
});
//API to logout a user
app.get('/api/logout',(req,res)=>{
    res.clearCookie('token');
    res.status(200).json("Looged out successfully");
});



