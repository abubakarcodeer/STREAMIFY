const express = require('express')
const chatRouter = express.Router();
const {protectRoute} = require('../middleware/authmiddleware');
const { getStremToken } = require('../controllers/chatController');

chatRouter.get('/token', protectRoute, getStremToken);

module.exports = chatRouter