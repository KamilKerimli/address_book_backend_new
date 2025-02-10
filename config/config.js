import mongoose from "mongoose";

export const configDb = async() =>{
    console.log("Start work");

    try {
        const connect = await mongoose.connect(process.env.MONGO_URL)
        console.log("Mongo DB with connected.");   
        console.log(connect.connection.host);   
    } catch (error) {
        console.log("error" , error);  
    }
    
}

export default configDb 