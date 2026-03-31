const authController = require('../controllers/authController');
const {protectRoute} = require("../middleware/authmiddleware");
const express = require('express');
const authRouter = express.Router();    

authRouter.post('/login', authController.login);
authRouter.post('/signup', authController.signup);
authRouter.post('/logout', authController.logout);

authRouter.post('/onboarding',protectRoute,authController.onboarding);

authRouter.get('/me',protectRoute,(req,res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
})

module.exports = authRouter;