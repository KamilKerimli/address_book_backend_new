import mongoose from "mongoose";

export const addresesSchema = mongoose.Schema({
    userId:{type: Number, required: true},
    addressType:{type: String, required: true},
    shortAddress:{type: String, required: true},
    realAddress:{type: String, required: true}
} , {timestamps:true});

const addresesSchema = mongoose.model("addreses" , addresesSchema)

export default addresesSchema