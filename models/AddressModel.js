import mongoose from "mongoose";

export const addresesSchema = mongoose.Schema({
    email:{type: String, required: true},
    addressType:{type: String, required: true},
    shortAddress:{type: String, required: true, unique: true},
    realAddress:{type: String, required: true}
} , {timestamps:true});

const addressItem = mongoose.model("addresses" , addresesSchema)

export default addressItem