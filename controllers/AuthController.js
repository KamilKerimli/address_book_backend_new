import userItem from '../models/UserModel.js';
import jwt from 'jsonwebtoken';

const register = async (req, res) => {
    try {
        const { first_name, username, email, password } = req.body;

        if (!first_name || !username || !email || !password) {
            return res.status(400).json({ message: "Please enter all area" });
        }

        const existingUser = await userItem.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exist" });
        }

        const existingUsernameUser = await userItem.findOne({username});
        if(existingUsernameUser){
            return res.status(409).json({ message: "The username you entered is already in use. Please enter a new username if you don't mind." });
        }

        const newUser = new userItem({
            first_name,
            username,
            email,
            password: password,
        });

        await newUser.save();
        res.status(201).json({ message: "The user has successfully registered.", redirect: '/auth/login' });
    } catch (err) {
        console.error("Error: ", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userItem.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found. Please enter the correct email or password." });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Email or password is not correct." });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });

        res.status(200).json({ token });
    } catch (err) {
        console.error("Error: ", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

const checkToken = async (req, res) => {
    try {
        const token = req.header('Authorization');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const currentTime = Math.floor(Date.now() / 1000);
        const remainingTime = decoded.exp - currentTime;

        res.status(200).json({
            message: "The token is valid.",
            expiresIn: `${remainingTime} seconds left.`,
        });
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            res.status(401).json({ message: "The token has expired." });
        } else {
            res.status(401).json({ message: "The token is invalid." });
        }
    }
};

export {register, login, checkToken };