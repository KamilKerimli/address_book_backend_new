import userItem from "../models/UserModel.js"
import addressItem from "../models/AddressModel.js"
import subscribeUserItem from "../models/SubscribeUserModel.js"
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
    
        const { 
            file,
            username, 
            firstName, 
            lastName,
            country,
            location,
            email,
            phone,
            birthday,
            addressList
        } = req.body;

        const user = await userItem.findOne({email});
        if (!user) return res.status(404).json({ message: "User not found"});

        if (!username || !country || 
        !location || !email || !phone || !birthday || !addressList) {
            return res.status(400).json({ message: "Please enter values for all fields." });
        }

        const newData = {
            first_name: firstName,
            last_name: lastName,
            birthday: birthday,
            country: country,
            location: location,
            phoneNumber: phone,
        };
    try {
        if (file) {
            const fileBuffer = req.file.buffer.toString('base64');

            const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${fileBuffer}`, {
                folder: 'address_book_images',
                resource_type: 'auto',
            });

            newData.imgURL = result.secure_url;
        }

        const updatedUser = await userItem.findByIdAndUpdate(
            user._id,
            { $set: newData },
            { new: true, runValidators: true }
        );

        for (let index = 0; index < addressList.length; index++) {
            const address = addressList[index];
            const existAddress = await addressItem.findOne({_id: address._id});
            if (existAddress != null) {
                const updatedAddress = await userItem.findByIdAndUpdate(
                    address._id,
                    { $set: address },
                    { new: true, runValidators: true }
                );
            }
            else{
                const newAddress = addressItem({
                    email: address.email,
                    addressType: address.addressType,
                    shortAddress: address.shortAddress,
                    realAddress: address.realAddress,
                });
                await newAddress.save();
            }
        }

        res.status(200).json({ message: "User all data updated"});
    } catch (err) {
        console.error("Error: ", err.message); 
        res.status(500).json({ message: "Server error"});
    }
};
//OK
const getUser = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ message: "Please enter email" });
        }
        
        const user = await userItem.findOne({email});

        if (user == null) {
            res.status(404).json({ message: "Please enter correct email" });
        } 

        return res.status(200).json({user: user});

    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ message: "Server error." });
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
//ok
const updatePassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }
        
        const user = await userItem.findOne({email});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        user.password = password;
        await user.save();  
        
        res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
//ok
const subscribeUser = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return req.status(400).json({message: "Please enter email address"})
    }

    try {
        const newEmail = new subscribeUserItem({
            email: email
        });
        await newEmail.save();

        res.status(200).json({message: "You subscripted."});
    } catch (error) {
        res.status(500).json({message: "Server error. Please try again later"});
    }
}
//
const getUsers = async (req, res) =>{
    try {
        const results = await userItem.find({}).sort({ createdAt: -1 });
        res.status(200).json({users: results});
    } catch (error) {
        res.status(500).json({message: "Server error. Please try again later"});
    }
}

const changeRole = async (req, res) => {
    const { email } = req.body;
    console.log(email);

  try {
    const user = await userItem.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = user.role === "admin" ? "user" : "admin";
    await user.save();

    res.status(200).json({ message: `User role changed to ${user.role === "admin" ? 'user' : 'admin'}` });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

export { createUser, updateUser, getUser, deleteUser, updatePassword, subscribeUser, getUsers, changeRole }