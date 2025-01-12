const mongoose = require('mongoose');
import { connectDB } from "../config/db";

const secondsubreplySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    author: { type: String, required: true },
    avatar: { type: String, required: true },
    content: { type: String, required: true },
    votes: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now },
    replies: [{
        type: mongoose.Schema.Types.Mixed,
        default: [] 
    }]
}, { _id: true });

const subreplySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    author: { type: String, required: true },
    avatar: { type: String, required: true },
    content: { type: String, required: true },
    votes: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now },
    replies: [secondsubreplySchema],
}, { _id: true });

const replySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    author: { type: String, required: true },
    avatar: { type: String, required: true },
    content: { type: String, required: true },
    votes: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now },
    replies: [subreplySchema],
}, { _id: true });

const commentSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    author: { type: String, required: true },
    avatar: { type: String, required: true },
    content: { type: String, required: true },
    votes: { type: Number, default: 0 },
    replies: [replySchema], // Embed replies as subdocuments directly in the comment
    timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

const connection = await connectDB();
export default connection.models.Comment || connection.model('Comment', commentSchema);
