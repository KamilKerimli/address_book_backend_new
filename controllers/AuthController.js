import userItem from '../models/UserModel.js';
import verifyCodeItem from '../models/VerifyCodesModel.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const register = async (req, res) => {
    try {
        const { username, email, phoneNumber, password } = req.body;

        if (!username || !email || !phoneNumber || !password) {
            return res.status(400).json({ message: "Please enter all area" });
        }

        const existingUser = await userItem.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exist" });
        }

        const existingUsernameUser = await userItem.findOne({username});
        if(existingUsernameUser){
            return res.status(409).json({ message: "This username is already in use." });
        }

        const newUser = new userItem({
            username,
            email,
            phoneNumber,
            password
        });
        await newUser.save();

        res.status(201).json({ message: "The user has successfully registered.", redirect: '/login' });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.query;
        
        if (!email || !password) {
            return res.status(400).json({ message: "Please enter all area" });
        }

        const user = await userItem.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found. Please enter the correct email or password." });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Email or password is not correct." });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({ token: token, role: user.role, email: user.email });
    } catch (err) {
        console.error("Error: ", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

const sendVerificationCode = async (req, res) => {
    const { email } = req.query;
    
    if (!email) {
        return res.status(400).json({message: "Please fill email area"});
    }
    const confirmCode = Math.floor(100000 + Math.random() * 900000);

    const existingUser = await userItem.findOne({ email });
    if (!existingUser) {
        return res.status(409).json({ message: "User not found. Please register or login. ;)" });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = { 
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Confirmation Code',
    html: `
        <div style="font-family: Arial, sans-serif; color: #333; text-align: center;">
            <h2 style="color:#0091ff;">Email Confirmation</h2>
            <p style="color:#0ebde9;">Hello,</p>
            <p style="color: #0ebde9;">Your confirmation code is:</p>
            <h1 style="font-size: 32px; color: #0091ff; margin: 20px 0;">${confirmCode}</h1>
            <p>Please use this code to confirm your email address.</p>
            <p>If you did not request this, please ignore this email.</p>
            <p>Thank you,</p>
            <p>Company Name</p>
        </div>
    `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        
        const newVerify = new verifyCodeItem({
            email,
            confirmCode
        });
        await newVerify.save();

        res.status(200).json({message: "Email send successfully :)"})
    } catch (error) {
        res.status(400).json({message: "Email is not sended :("})
    }
};

const getCode = async (req, res) =>{
    try {
        const { email } = req.query;

        if (!email) { return res.status(400).json({ message: "Please enter all area" }); }
    
        const verifyCode = await verifyCodeItem
                                .find({ email }) 
                                .sort({ createdAt: -1 })
                                .limit(1); 
    
        res.status(200).json({code: verifyCode[0].confirmCode });
    } catch (err) {
        res.status(500).json({message: 'Server error' });
    }
}

export { login, register, sendVerificationCode, getCode };