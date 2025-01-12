const mongoose = require('mongoose');
import { connectDB } from "../config/db";
const connection = await connectDB();

const StaffSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline'
    }
}, {
    timestamps: true
});

const Staff = connection.models.Staffs || connection.model('Staffs', StaffSchema);

export default Staff