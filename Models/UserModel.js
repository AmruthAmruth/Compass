import mongoose from "mongoose";



const UserSchema = new mongoose.Schema(
    {
      username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      name:{
        type:String,
        require:true
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },
      password: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
        default: "",
      },
      bio: {
        type: String,
        maxlength: 150,
        default: "",
      },
      followers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      following: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      posts: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Post",
        },
      ],
      savedPosts: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Post",
        },
      ],
      isVerified: {
        type: Boolean,
        default: false,
      },
      website: {
        type: String,
        default: "",
      },
      location: {
        type: String,
        default: "",
      },
      gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        default: "Other",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    { timestamps: true }
  );
  
  export default mongoose.model("User", UserSchema);