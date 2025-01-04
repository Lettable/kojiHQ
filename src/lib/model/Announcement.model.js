const mongoose = require('mongoose');

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

const AnnouncementModel = mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);
export default AnnouncementModel;