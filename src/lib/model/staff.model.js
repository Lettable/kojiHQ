const mongoose = require('mongoose');

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

const Staff = mongoose.models.Staffs || mongoose.model('Staffs', StaffSchema);

export default Staff