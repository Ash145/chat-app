import jwt from "jsonwebtoken"
import { ENV } from "./env.js";

export const generateToken = (userId, res) => {

    const { SECRET_KEY } = ENV
    if (!SECRET_KEY) {
        throw new Error("JWT SECRECT KEY is not configured");
    }

    const token = jwt.sign({userId}, SECRET_KEY, {
        expiresIn: "7d"
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: ENV.NODE_ENV === "production" ? true : false
    });
    return token;
};