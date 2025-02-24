import mongoose from "mongoose";

export const verifyCodesSchema = mongoose.Schema({
    email:{type: String, required: true},
    confirmCode:{type: Number, required: true}
} , {timestamps:true});

const verifyCodeItem = mongoose.model("verifycodes" , verifyCodesSchema)

export default verifyCodeItem