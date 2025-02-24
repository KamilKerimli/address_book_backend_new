import mongoose from "mongoose";

export const notificationsSchema = mongoose.Schema({
    userId:{type: Number, required: true},
    notificationType:{type: String, required: true},
    notificationContent:{type: String, required: true}
} , {timestamps:true});

const notificationsSchema = mongoose.model("notifications" , notificationsSchema)

export default notificationsSchema