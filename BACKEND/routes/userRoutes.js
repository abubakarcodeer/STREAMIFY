const express = require("express");
const { getRecommendations,getMyFriends,sendFriendRequest,acceptFriendRequest,getFriendRequests,getOutgoingFriendReqs,withdrawFriendRequest } = require("../controllers/userController");
const { protectRoute } = require("../middleware/authmiddleware");

const userRouter = express.Router();

userRouter.use(protectRoute);

userRouter.get("/", getRecommendations);
userRouter.get("/friends", getMyFriends);

userRouter.post('/friend-request/:id', sendFriendRequest);
userRouter.put('/friend-request/:id/accept', acceptFriendRequest);
userRouter.delete('/friend-request/:id/withdraw', withdrawFriendRequest);

userRouter.get('/friend-requests', getFriendRequests);
userRouter.get('/outgoing-friend-requests', getOutgoingFriendReqs);


module.exports = userRouter;