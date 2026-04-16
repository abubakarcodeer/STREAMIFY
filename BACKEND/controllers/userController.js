const User = require('../models/user');
const FriendRequest = require('../models/FriendRequest');
exports.getRecommendations = async (req, res) => {
    try{
        const currentUserId = req.user.id;
        // Fetch current user with friends array
        const currentUser = await User.findById(currentUserId).select('friends');
        
        const recommendedUsers = await User.find({ $and: [
            {_id: {$ne: currentUserId}}, //exclude the current user
            {_id: {$nin: currentUser.friends || []}}, //exclude current user's friends
            {isOnboarded: true} //only show onboarded users
         ]
        }).select('fullName email profilePic nativeLanguage learningLanguage bio location');
        
        res.status(200).json(recommendedUsers);
    }catch(err){
        console.error(err);
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
        const recipient = await User.findById(recipientId);
        if(!recipient){
            return res.status(404).json({ message: "Recipient user not found" });
        }
        // Convert ObjectIds to strings for proper comparison
        if(recipient.friends.some(friendId => friendId.toString() === myId)){
            return res.status(400).json({ message: "You are already friends with this user" });
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
      
        res.status(201).json({ success: true, friendRequest });

    }catch(err){
        console.error(err);
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
        await User.findByIdAndUpdate(friendRequest.sender,{
            $addToSet: { friends: friendRequest.recipient }
        });
        await User.findByIdAndUpdate(friendRequest.recipient,{
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

        // Show requests SENT by current user that were ACCEPTED by recipient
        const acceptedReqs = await FriendRequest.find({ sender: req.user.id, status: "accepted" }).populate('recipient', 'fullName email profilePic nativeLanguage learningLanguage');
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

exports.withdrawFriendRequest = async (req, res) => {
    try{
        const {id:requestId} = req.params;
        const friendRequest = await FriendRequest.findById(requestId);
        
        if(!friendRequest){
            return res.status(404).json({ message: "Friend request not found" });
        }
        
        if(friendRequest.sender.toString() !== req.user.id){
            return res.status(403).json({ message: "You are not authorized to withdraw this friend request" });
        }
        
        await FriendRequest.findByIdAndDelete(requestId);
        res.status(200).json({ message: "Friend request withdrawn" });

    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}