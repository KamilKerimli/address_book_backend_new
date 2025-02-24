import mongoose from "mongoose";

export const favoriteSchema = mongoose.Schema({
    userId:{type: Number, required: true},
    userIdTo:{type: Number, required: true}
} , {timestamps:true});

const favoriteSchema = mongoose.model("favorites" , favoriteSchema)

export default favoriteSchema