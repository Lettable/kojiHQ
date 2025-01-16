import mongoose from "mongoose";
import { connectDB } from "../config/db";

const connection = await connectDB("MAIN");

const userSchema = new mongoose.Schema({
    user_id: {
        type: Number,
        required: true,
        trim: true
    },
    token: {
        type: String,
        required: false,
        trim: true,
        default: null
    },
    is_running: {
        type: Boolean,
        required: false,
        default: false
    },
    is_activated: {
        type: Boolean,
        required: true,
        default: false
    },
    credits: {
        type: Number,
        required: false,
        default: 1
    },
});

const Users = connection.models.users || connection.model("users", userSchema);
export default Users;