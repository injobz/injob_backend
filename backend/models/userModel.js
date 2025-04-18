require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: { 
        type: String, 
        required: true, 
        trim: true 
    },
    lastName: { 
        type: String, 
        required: true, 
        trim: true 
    },
    emailId: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /.+\@.+\..+/ 
    },
    password: { 
        type: String, 
        required: true,
        minlength: 6 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});
userSchema.methods.isPassValid = async function(password){
    return await bcrypt.compare(password,this.password);
}
userSchema.methods.getJWT=function(){
    return jwt.sign({_id:this._id},process.env.JWT_SECRET_KEY);
}

module.exports = mongoose.model("User", userSchema);
