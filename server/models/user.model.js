import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username:{
        type: String,
        required: true,
        unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role:{
        type: String,
        enum: ['student', 'teacher'],
        required: true,
    },
     class: {
      type: String,
      required: [true, 'Class is required'],
     
    },
   
  },
  { timestamps: true }
);




const User =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;