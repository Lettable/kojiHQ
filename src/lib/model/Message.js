// import mongoose from 'mongoose';

// const MessageSchema = new mongoose.Schema({
//   senderId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   receiverId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   content: {
//     type: String,
//     required: true,
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now,
//   },
//   isRead: {
//     type: Boolean,
//     default: false,
//   },
//   projectId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Project',
//   },
// });

// export default mongoose.models.Message || mongoose.model('Message', MessageSchema);


// import mongoose from "mongoose";

// const messageSchema = new mongoose.Schema(
//   {
//     username: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     content: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

// export default Message;


import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  username: { type: String, required: true },
  content: { type: String, required: true },
  profilePic: { type: String, required: true },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Message || mongoose.model('Message', messageSchema);
