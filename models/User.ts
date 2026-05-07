import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ["author", "reader"], default: "reader" },
  avatar: String,
}, { timestamps: true });

export default models.User || model("User", UserSchema);
