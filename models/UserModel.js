import mongoose from "mongoose";
import bcrypt from 'bcrypt'

export const usersSchema = mongoose.Schema({
    imgURL:{type:String, default: "defaultProfileImg"},
    first_name:{type:String, default: ""},
    last_name:{type:String, default: ""},
    username:{type:String, required: true, unique: true},
    birthday:{type:Date, default: null},
    phoneNumber:{type:String, required: true}, 
    email:{type:String, required: true}, 
    password:{type:String, required: true},
    country:{type:String, default: "Azerbaijan"},
    location:{type:String, default: "Azerbaijan, Baku"},
    isActive:{type:Boolean, default: false},
    confrimEmail:{type:Boolean, default: false},
    complectedRegister:{type:Boolean, default: false},
    role: { type: String, default: 'user' } 
}, {timestamps:true});

usersSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 4);
    }
    next();
});

usersSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const userItem = mongoose.model("users" , usersSchema)

export default userItem