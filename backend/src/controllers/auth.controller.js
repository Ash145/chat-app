import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if ( !fullName || !email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be atleast 8 characters long"});
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({ 
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })

        } else {
            return res.status(400).json({ message: "Error creating user" });
        }
    } catch (err) {
        console.error("Error in signup:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const signin = (req, res) => {
    res.send("Signin route");
};

export const signout = (req, res) => {
    res.send("Signout route");
};