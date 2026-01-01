import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

export const getAllContacts = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getting contacts:", error);
    }
};

export const getMessagesById = async (req, res)=> {
    try {
        const myId = req.user._id;
        const { id: sendToUserId } = req.params;

        const messages = await Message.find({
            $or: [
                {
                    senderId: myId,
                    receiverId: sendToUserId
                },
                {
                    senderId: sendToUserId,
                    receiverId: myId
                }
            ]
        });
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getting messages by id: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;

        let imageURL;
        if (image) {
            const imageUploadResponse = await cloudinary.uploader.upload(image);
            imageURL = imageUploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId: senderId,
            receiverId: receiverId,
            text: text,
            image: imageURL
        });

        await newMessage.save();

        //send message to user in real time
        
        res.status(201).json({ message: "Message sent successfully" });

    } catch (error) {
        console.error("Error in sending message: ", error.message);
        res.status(500).json({ message: "Interval server error" });
    }
}

export const getMyChats = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        console.log(loggedInUserId, "Hiiiiii")

        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId },
                { receiverId: loggedInUserId }
            ]
        });

        const myChatsIds = [
            ...new Set(
                messages.map((msg) =>
                    msg.senderId.toString() === loggedInUserId.toString()
                    ? msg.receiverId.toString()
                    : msg.senderId.toString()
                )
            )
        ];

        const myChats = await User.find({ _id: { $in: myChatsIds } }).select("-password");
        res.status(200).json(myChats);  

    } catch (error) {
        console.error("Error in getting the chats: ", error.message)
        res.status(500).json({ message: "Intermal server error" });
    }
}