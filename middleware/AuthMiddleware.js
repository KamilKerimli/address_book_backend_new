import jwt from 'jsonwebtoken';
import userItem from '../models/UserModel.js';

export const authenticate = async (req, res, next) => {
    try {
        console.log()
        const token = req.header('Authorization');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userItem.findOne({ _id: decoded._id });

        if (!user) {
            res.status(404).json({message: "Please try again login"});
            return;
            // throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Please authenticate.' });
    }
};

export const authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied. You do not have the required role.' });
        }
        next();
    };
};