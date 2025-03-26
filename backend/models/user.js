const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required:true,
        unique:true, 
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    age: {
        type: Number,
        
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required:true
       
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
