import mongoose from "mongoose";

export const mongoDbConfig = async() =>{

    try {
        const connect = await mongoose.connect(process.env.MONGO_URL)
        console.log("Mongo DB with connected.");
    } catch (error) {
        console.log("error" , error);  

    }
    
}

export default mongoDbConfig 