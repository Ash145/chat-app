import User from "../models/User.js"
import bcrypt from "bcryptjs"
import "dotenv/config"
import { generateToken } from "../lib/utils.js"
import { sendWelcomeEmail } from "../emails/emailHandlers.js"
import { ENV } from "../lib/env.js"
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req, res) => {
    console.log(req.body,'llllll')
    const { fullName, email, password } = req.body;
    try {
        if(!fullName || !password || !email) {
            return res.status(400).json({ message: "All fields are required" })
        }
        
        if(password.length < 8) {
            return res.status(400).json({ message: "Password must be atleast 8 characters long" })
        }
        
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message:"Invalid email address" });
        }
        
        const user = await User.findOne({email});
        if (user) {
            return res.status(400).json({ message: "User with this email address already exists" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });

        if(newUser) {
            const savedUser = await newUser.save();
            generateToken(savedUser._id, res);

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            });

            try {
                await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL);
            } catch (error) {
                console.error("Error sending welcome email", error);
            }

        } else {
            console.error("Invalid User Data")
        }

    } catch (error) {
        console.error("error in signing up: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {

        if (!email || !password) {
            return res.status(400).json({ message: "email and password are required" });
        }

        const user = await User.findOne({email});
        
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        } 
        
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        
        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        });
    } catch (error) {
        console.error("Error in logging in", error);
        res.status(500).json({ message: "Internal Server Error"});
    }
}

export const logout = (_, res) => {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        if (!profilePic) return res.status(400).json({ message: "Profile pic is required" });

        const userId = req.user._id;

        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error in updating profile: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};