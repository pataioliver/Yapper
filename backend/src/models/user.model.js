import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 4,
        },
        profilePicture: {
            type: String,
            default: "",
        },
        resetPasswordToken: {
            type: String
        },
        resetPasswordExpires: {
            type: Date
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;