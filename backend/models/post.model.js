import mongoose from "mongoose";
const postSchema = new mongoose.Schema(
  {
    caption: { type: String, default: "" },
    image: { type: String, default: null },
    video: { type: String, default: null },
    fileType: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
