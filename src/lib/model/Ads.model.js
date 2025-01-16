import mongoose from "mongoose";
import { connectDB } from "../config/db";

const connection = await connectDB("MAIN");

const adsSchema = new mongoose.Schema(
    {
        user_id: {
            type: Number,
            trim: true,
            required: true,
            default: "No User ID Found"
        },
        group_name: {
            type: String,
            trim: true,
            required: true,
            default: "No Group Name Found"
        },
        group_id: {
            type: String,
            trim: true,
            required: true,
            default: "No Group ID Found"
        },
        message_content: {
            type: String,
            required: true,
            default: "No Content Found"
        },
        group_ad_link: {
            type: String,
            required: true,
            default: "No Link Found"
        },
        createdAt: {
            type: Date,
            default: Date.now()
        },
    },
    { collection: "adHistory" }
);

const AdHistory = connection.models.adHistory || connection.model("adHistory", adsSchema, "adHistory");

export default AdHistory;
