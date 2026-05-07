import mongoose, { Schema, model, models } from "mongoose";

const PostSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: String,
  coverImage: String,
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  tags: [String],
}, { timestamps: true });

PostSchema.index({ title: "text", content: "text", tags: "text" });

export default models.Post || model("Post", PostSchema);
