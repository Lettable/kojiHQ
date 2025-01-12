const mongoose = require('mongoose');
import { connectDB } from "../config/db";

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const connection = await connectDB();
const AnnouncementModel = connection.models.Announcement || connection.model('Announcement', announcementSchema);
export default AnnouncementModel;