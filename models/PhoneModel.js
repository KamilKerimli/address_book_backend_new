import mongoose from "mongoose";

export const phonesSchema = mongoose.Schema({
    userId:{type: Number, required: true},
    phoneType:{type: String, required: true},
    countryCode:{type: String, required: true},
    phoneNumber:{type: String, required: true}
} , {timestamps:true});

const phonesSchema = mongoose.model("phones" , phonesSchema)

export default phonesSchema