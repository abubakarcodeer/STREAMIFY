const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {createStreamUser, generateStreamToken} = require("../utils/stream");

exports.signup = async (req, res) => {
  // Handle user signup logic here
  const { email, password, fullName } = req.body;
  try {
    if (!email || !password || !fullName) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Please provide a valid email address" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({
          message: "Email already exists, please use a different email",
        });
    }
    const idx = Math.floor(Math.random() * 10); // Generate a random number between 0 and 09
    const randomPic = `https://randomuser.me/api/portraits/lego/${idx}.jpg`;

    const newUser = await User.create({
      fullName,
      email,
      password,
      profilePic:randomPic
    });

    // creating the user in stream as well
    let streamToken = null;
    try{
      await createStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || ''
      });
      // streamToken = generateStreamToken(newUser._id.toString());
    }catch(err){
      console.error("Error creating user in Stream:", err);
    }

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(201).json({
      success: true,
      user:newUser
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async(req, res) => {
  // Handle user login logic here
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400)
        .json({ message: "Please provide both email and password" });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      user
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.logout = (req, res) => {
  // Handle user logout logic here
  res.clearCookie("jwt");
  res.status(200).json({ message: "User logged out successfully" });

};

exports.onboarding = async (req, res) => {
  // Handle user onboarding logic here
  try {
    const userId = req.user._id;
    const { bio, fullName, nativeLanguage, learningLanguage, location } = req.body;

    if (!bio || !fullName || !nativeLanguage || !learningLanguage || !location) {
      return res.status(400).json({ message: "Please provide all required fields",
        missingFields: [
         !fullName && "fullName",!bio && "bio",!nativeLanguage && "nativeLanguage",!learningLanguage && "learningLanguage",!location && "location"  
       
        ].filter(Boolean),
     });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, {
      ...req.body,
      isOnboarded: true
    }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    try{
      await createStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || ''
      });
    }catch(err){
      console.error("Error updating user in Stream:", err);
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }

};