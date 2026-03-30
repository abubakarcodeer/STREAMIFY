const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.protectRoute = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;
        if(!token) {
            return res.status(401).json({message: "Unauthorized: No token provided"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(!decoded || !decoded.userId) {
            return res.status(401).json({message: "Unauthorized: Invalid token"});
        }
        const user = await User.findById(decoded.userId);
        if(!user) {
            return res.status(401).json({message: "Unauthorized: User not found"});
        }
        req.user = user;
        next();

    }catch(err){
        return res.status(401).json({message: "Unauthorized: No token provided"});
    }  

}