import User from "../models/user.model.js";
import Message from "../models/message.model.js";

export const getSidebarUsersList = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: currentUserId}}).select("-password");

        res.status(200).json(filteredUsers);
    } catch (err) {
        console.error("Error fetching sidebar users list:", err);
        res.status(500).json({ message: "Internal Server Error" }); 
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await User.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChat, receiverId: myId }
            ]
        });

        res.status(200).json(messages);
    } catch (err) {
        console.error("Error in get messages controller", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;

        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        await newMessage.save();
        // real time socket io functionality
        res.status(201).json(newMessage);

    } catch (err) {
        console.error("Error in sendMessage controller: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}