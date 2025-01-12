import mongoose from "mongoose";
import { connectDB } from "../config/db";

// const MONGO_URI = "mongodb+srv://pythoncux:pythoncux@cluster0.tl7krxg.mongodb.net/MAIN";

// mongoose
//   .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("Error connecting to MongoDB:", err));

const connection = await connectDB("MAIN");

const adsSchema = new mongoose.Schema({
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
});

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

const forwardSchema = new mongoose.Schema({
    user_id: {
        type: String,
        trim: true,
        required: true
    },
    count: {
        type: Number,
        required: true,
        default: 1
    },
});

const Ads = connection.models.adHistory || connection.model("adHistory", adsSchema);
const Users = connection.models.users || connection.model("users", userSchema);
const Forward = connection.models.forwarded || connection.model("forwarded", forwardSchema);

export { Ads, Users, Forward };