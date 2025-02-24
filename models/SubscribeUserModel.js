import mongoose from "mongoose";

export const subscribeUserSchema = mongoose.Schema({
    email:{type: String, required: true},
} , {timestamps:true});

const subscribeUserItem = mongoose.model("subscribes" , subscribeUserSchema)

export default subscribeUserItem