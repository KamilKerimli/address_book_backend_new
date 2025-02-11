import {v2 as cloudinary} from "cloudinary";

export const cloudinaryConfig = async() =>{
    try {
        cloudinary.config({ 
            cloud_name: 'dsqegk33q', 
            api_key: '712535155215916', 
            api_secret: process.env.CLOUDINARY_SECRET_KEY 
        });

        console.log('Cloudinary was successfully');
    } catch (error) {
        console.log("error" , error);  
    }
    
}

export default cloudinaryConfig 