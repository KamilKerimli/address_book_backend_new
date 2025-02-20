import userItem from "../models/UserModel.js"
import fs  from "fs";
import  path  from "path";
import { fileURLToPath } from 'url';
import cloudinary from 'cloudinary';
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//get
/* const getUsers = async (req, res) => {
    try {
        const users = await userItem.find({});
        if (users.length === 0) {
            console.log("No users found");
            res.status(404).json({ message: "No users found" });
        } else {
            res.json(users);
        }
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ error: "An error occurred while fetching users" });
    }
}; */
const login = async (req, res) =>{
    try {
        const { email, password } = req.body;

        const user = await userItem.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "test Invalid credentials." });
        }

        // Şifreyi karşılaştır
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // Token'ı kullanıcıya döndür
        res.status(200).json({ message: 'Welcome Home Sir' });
    } catch (err) {
        res.status(500).json({ message: "Server error." });
    }
}

// Move another loaction.
const phoneCodes = async (req, res) => {
    try {
        const filePath = path.join(__dirname, '../datas/phoneCode.json');

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).json({ message: 'Server error', error: err.message });
            }
            res.status(200).json(JSON.parse(data));
        });
    } catch (err) {
        res.status(404).json({ message: "Server error: " || err.message })
    }
    
}
// OK
const createUser = async (req, res) => {
    try {
        const { first_name, username, birthday, email, password } = req.body;

        if (!first_name || !username || !birthday || !email || !password) {
            return res.status(400).json({ message: "Please all field enter value." });
        }

        const existingUser = await userItem.findOne({ email });

        // return res.json({object: existingUser, mess: "No"});

        if (existingUser) {
            return res.status(409).json({ message: "User already exists. Please enter other email" });
        }
        
        const existingUsername = await userItem.findOne({ username });
        if (existingUsername) {
            return res.status(409).json({ message: "Username already exists. Please enter other username" });
        }

        // const newUser = new userItem({
        //     first_name: first_name,
        //     username:username,
        //     birthday:birthday,
        //     email:eml, 
        //     password: password
        // });
        // await newUser.save();

        res.status(200).json({ message: "Please confirm email address"});
    } catch (err) {
        console.error("Error: ", err); 
        res.status(500).json({ message: "Server error"});
    }
};

//OK
const getUser = async (req, res) => {
    try {
        const email = req.params.email;
        const password = req.params.password;

        if (!email || !password) {
            return res.status(400).json({ message: "Please enter email and password" });
        }
        
        const user = await userItem.findOne({email});

        if (user == null) {
            res.status(404).json({ message: "Please enter correct email or password" });
        } 

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Please enter correct password" });
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({token, role:user.role});

    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ error: "Server error." });
    }
};
const uploadProfileFile = async (req, res) => {
    if(!req.file){
        return res.status(400).json({message : "No send file"});
    }

    try {
        console.log('Fayl yükləndi, Cloudinary-ə göndərilir...');

        // Faylın buffer məlumatını base64 formatına çevir
        const fileBuffer = req.file.buffer.toString('base64');

        // Cloudinary-ə yüklə
        const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${fileBuffer}`, {
            folder: 'address_book_images',
            resource_type: 'auto',
        });

        console.log('Şəkil Cloudinary-ə uğurla yükləndi:', result.secure_url);

        // Cavab olaraq şəklin URL-ni qaytar
        res.status(200).json({
            message: 'Şəkil uğurla yükləndi!',
            imageUrl: result.secure_url,
        });
    } catch (err) {
        console.error('Şəkil yüklənmədi:', err);
        res.status(500).json({ message: 'Şəkil yüklənmədi.', error: err.message });
    }
}


//delete
const deleteUser = async (req,res) => {
    
    try {
        const {id} = req.params
        await userItem.findByIdAndDelete(id)
        res.json( "user deleted successfully")
    } catch (error) {
        console.log("user not exist");
        
    }
}


export { phoneCodes, createUser, getUser, uploadProfileFile, login }