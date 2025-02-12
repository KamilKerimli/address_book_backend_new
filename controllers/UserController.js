import userItem from "../models/UserModel.js"
import fs  from "fs";
import  path  from "path";
import { fileURLToPath } from 'url';
import cloudinary from 'cloudinary';

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

const getUser = async (req, res) => {
    const { token } = req.body;
    try {
        const users = await userItem.find()
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
};
 
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

const createUser = async (req, res) => {
    try {
        const { frt_name, usrnm, brthdy, eml, pasw } = req.body;

        // Check if required fields are provided
        if (!frt_name || !usrnm || !brthdy || !eml || !pasw) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await userItem.findOne({ eml });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        // Create new user
        const newUser = new userItem({
            imgURL:"",
            first_name: frt_name,
            last_name: "",
            birthday: brthdy,
            username:usrnm,
            email:eml,
            password:pasw,
            phoneCode:"",
            phone:""
        });
        await newUser.save();

        res.status(201).json({ message: "User created successfully"});
    } catch (err) {
        console.error("Error: ", err); 
        res.status(500).json({ message: "Database connection or another error | Error: " || err.message });
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

/* const postUsers = async(req,res) =>{
    
    try { 
        const newUsers = req.body
       await userItem.create(newUsers)
        res.json(newUsers)
    } catch (error) {
        console.log("Post time error");
        
    }
} */


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