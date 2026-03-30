const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    bio:{
        type: String,
        default: ''
    },
    profilePic:{
        type: String,
        default: ''
    },
    nativeLanguage:{
        type: String,
        default: ''
    },
    learningLanguage:{
        type: String,
        default: ''
    },
    location:{
        type: String,
        default: ''
    },
    isOnboarded:{
        type: Boolean,
        default: false
    },
    friends:[
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'  
        }
    ]

},{timestamps: true});

// Pre-save hook for password hashing
userSchema.pre('save', async function(){
    if(!this.isModified('password')) {
        return;
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
    } catch (error) {
        throw error;
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
