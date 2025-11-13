import jwt from "jsonwebtoken";
import User from "../models/user.js";
const generateToken = (id) => {
    return jwt.sign({ id , role: User.role}, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

export default generateToken;