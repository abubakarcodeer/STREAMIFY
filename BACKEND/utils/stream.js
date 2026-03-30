const { StreamChat } = require("stream-chat");
require("dotenv").config();

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;

if(!api_key || !api_secret) {
    throw new Error("Stream API key and secret are required");
}

const streamClient = StreamChat.getInstance(api_key, api_secret);

exports.createStreamUser = async (userData) => {
    try {
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.error("Error creating Stream user:", error);
        throw error;
    }   
}

exports.generateStreamToken = (userId) => {
    // try {
    //     const token = streamClient.createUserToken(userId);
    //     return token;
    // } catch (error) {
    //     console.error("Error generating Stream token:", error);
    //     throw error;
    // }
}