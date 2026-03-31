const User = require('../models/user');
const FriendRequest = require('../models/FriendRequest');
exports.getRecommendations = async (req, res) => {
    try{
        const currentUserId = req.user.id;
        const currentUSer = req.user;
        const recommendedUsers = await User.find({ $and: [
            {_id: {$ne: currentUserId}}, //exclude the current user
            {_id: {$nin: currentUSer.friends}}, //exclude current user's friends
            {isOnboarding: true}
         ]
        })
        res.status(200).json(recommendedUsers);
    }catch(err){
        res.status(500).json({ message: "Server error" });
    }
}
exports.getMyFriends = async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select("friends").populate('friends', 'fullName email profilePic nativeLanguage learningLanguage');
        res.status(200).json(user.friends);
    }catch(err){
        res.status(500).json({ message: "Server error" });
    }
}
exports.sendFriendRequest = async (req, res) => {
    try{
        const myId = req.user.id;
        const {id:recipientId} = req.params;
        if(myId === recipientId){
            return res.status(400).json({ message: "You cannot send a friend request to yourself" });
        }
        if(recipient.friends.includes(myId)){
            return res.status(400).json({ message: "You are already friends with this user" });
        }
        const recipient = await User.findById(recipientId);
        if(!recipient){
            return res.status(404).json({ message: "Recipient user not found" });
        }
        // Check if a friend request already exists
        const existingRequest = await FriendRequest.findOne({
           $or:[
             { sender: myId, recipient: recipientId },
             { sender: recipientId, recipient: myId }
           ]
        });
        if(existingRequest){
            return res.status(400).json({ message: "Friend request already sent" });
        }
        // Create a new friend request
        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId
        });
      
        res.status(201).json( friendRequest );

    }catch(err){
        res.status(500).json({ message: "Server error" });
    }
}

exports.acceptFriendRequest = async (req, res) => {
    try{
        const {id:requestId} = req.params
        const friendRequest = await FriendRequest.findById(requestId);
        if(!friendRequest){
            return res.status(404).json({ message: "Friend request not found" });
        }
        if(friendRequest.recipient.toString() !== req.user.id){
            return res.status(403).json({ message: "You are not authorized to accept this friend request" });
        }
        // Update the friend request to be accepted
        friendRequest.status = "accepted";
        await friendRequest.save();

        // Add the users to each other's friends list
        await User.findByIdandUpdate(friendRequest.sender,{
            $addToSet: { friends: friendRequest.recipient }
        });
        await User.findByIdandUpdate(friendRequest.recipient,{
            $addToSet: { friends: friendRequest.sender }
        });
        
        res.status(200).json({ message: "Friend request accepted" });

    }catch(err){
        res.status(500).json({ message: "Server error" });
    }
}
exports.getFriendRequests = async (req, res) => {
    try{
        const incomingReqs = await FriendRequest.find({ recipient: req.user.id, status: "pending" }).populate('sender', 'fullName email profilePic nativeLanguage learningLanguage');

        const acceptedReqs = await FriendRequest.find({ recipient: req.user.id, status: "accepted" }).populate('sender', 'fullName email profilePic nativeLanguage learningLanguage');
        res.status(200).json({ incomingReqs, acceptedReqs });

    }catch(err){
        res.status(500).json({ message: "Server error" });
    }
}
exports.getOutgoingFriendReqs = async (req, res) => {
    try{
        const outgoingReqs = await FriendRequest.find({
            sender: req.user.id,
            status: "pending"
        }).populate('recipient', 'fullName email profilePic nativeLanguage learningLanguage');
        res.status(200).json({ outgoingReqs
        })

    }catch(err){
        res.status(500).json({ message: "Server error" });
    }
}