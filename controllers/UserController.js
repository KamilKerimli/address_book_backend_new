import userItem from "../models/UserModel.js"
import cloudinary from 'cloudinary';

// OK
const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please all field enter value." });
        }

        const existingUser = await userItem.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists. Please enter other email" });
        }
        
        const existingUsername = await userItem.findOne({ username });
        if (existingUsername) {
            return res.status(409).json({ message: "Username already exists. Please enter other username" });
        }

        const newUser = new userItem({
            username:username,
            email:email, 
            password: password
        });
        await newUser.save();

        res.status(200).json({ message: "Please confirm email address"});
    } catch (err) {
        console.error("Error: ", err); 
        res.status(500).json({ message: "Server error"});
    }
};

//ok
const updateUser = async (req, res) => {
    try {
        const { 
            username, 
            first_name, 
            last_name,
            country,
            location,
            email,
            password,
            phoneNumber,
            birthday,
            addresses,
            request
        } = req.body;

        const user = userItem.findOne({email});
        if (!user) return res.status(404).json({ message: "User not found"});

        if (!username || !last_name || !first_name || !country || 
        !location || !email || !phoneNumber || !birthday || !addresses || 
        !request) {
            return res.status(400).json({ message: "Please enter values for all fields." });
        }

        const newData = {
            first_name: first_name,
            last_name: last_name,
            birthday: birthday,
            country: country,
        };

        if (req.file) {
            const fileBuffer = req.file.buffer.toString('base64');

            const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${fileBuffer}`, {
                folder: 'address_book_images',
                resource_type: 'auto',
            });

            newData.imgURL = result.secure_url;
        }

        if (request === "update" && password) {
            newData.password = await bcrypt.hash(password, 4);
        }

        const updatedUser = await userItem.findByIdAndUpdate(
            user._id,
            { $set: newData },
            { new: true, runValidators: true }
        );

        res.status(200).json({ message: "Please confirm email address", user: updateUser});
    } catch (err) {
        console.error("Error: ", err); 
        res.status(500).json({ message: "Server error"});
    }
};

//OK
const getUser = async (req, res) => {
    try {
        const email = req.query.email;

        if (!email) {
            return res.status(400).json({ message: "Please enter email" });
        }
        
        const user = await userItem.findOne({email});

        if (user == null) {
            res.status(404).json({ message: "Please enter correct email" });
        } 

        // const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({message: "ok"});

    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ error: "Server error." });
    }
};

//ok
const deleteUser = async (req,res) => {
    try {
        const email = req.params.email;
        const user = await userItem.findOne({email});
        if(user === null){
            return res.status(404).json({message: "Please send correct email address"});
        }
        await userItem.findByIdAndDelete(user._id);
        return res.status(200).json({message: "User deleted successfully"})
    } catch (error) {
        return res.status(404).json({message: "Server error"});
    }
}

export { createUser, updateUser, getUser, deleteUser}