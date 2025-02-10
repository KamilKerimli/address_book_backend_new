import mongoose from "mongoose";

export const usersSchema = mongoose.Schema({
    imgURL:{type:String, default: ""},
    first_name:{type:String, required: true},
    last_name:{type:String, default: ""},
    birthday:{type:Date, required: true},
    username:{type:String, required: true},
    email:{type:String, required: true}, 
    password:{type:String, required: true},
    phoneCode:{type:String, default: ""},
    phone:{type:String, default: ""}
} , {timestamps:true})

const userItem = mongoose.model("users" , usersSchema)

export default userItem