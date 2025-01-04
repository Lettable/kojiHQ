import mongoose from "mongoose";

const LoginActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ip: {
    type: String,
    required: true,
  },
  device: {
    type: Object,
  },
  loginDate: {
    type: Date,
    default: Date.now,
  },
},{ timestamps: true });

const LoginActivity =
  mongoose.models.LoginActivity ||
  mongoose.model("LoginActivity", LoginActivitySchema);

export default LoginActivity;
