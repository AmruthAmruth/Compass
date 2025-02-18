import mongoose from "mongoose";



const PostSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      caption: {
        type: String,
        maxlength: 2200, 
        default: "",
      },
      imageUrl: {
        type: String,
        required: true, 
      },
      likes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      comments: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          text: {
            type: String,
            required: true,
            maxlength: 500, 
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      tags: [
        {
          type: String,
        },
      ],
      location: {
        type: String,
        default: "",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    { timestamps: true }
  );
  

  export default mongoose.model("Post",PostSchema)