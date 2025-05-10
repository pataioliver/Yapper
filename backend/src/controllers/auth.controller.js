import { generateToken, generateEmailVerificationToken, verifyEmailVerificationToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import { sendEmail } from "../email.js";
import crypto from "crypto";

export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate a reset token
        
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Hash the reset token using bcrypt
        const hashedToken = await bcrypt.hash(resetToken, 10);

        // Save the hashed token and expiration time to the database
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour
        await user.save();

        // Send reset email
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        const message = `Click the link below to reset your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`;

        await sendEmail(user.email, "Password Reset Request", message);

        res.status(200).json({ message: "Password reset email sent." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordExpires: { $gt: Date.now() }, // Ensure token is not expired
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Compare the provided token with the hashed token in the database
        const isTokenValid = await bcrypt.compare(token, user.resetPasswordToken);
        if (!isTokenValid) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Clear the reset token and expiration
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while resetting password" });
    }
};

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Please enter all fields" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Generate a verification code and token
        const verificationCode = Math.floor(100000 + Math.random() * 900000); // 6-digit code
        const token = generateEmailVerificationToken(email, verificationCode);

        // Send the verification email
        await sendEmail(
            email,
            "Verify Your Email",
            `Your verification code is: ${verificationCode}\n\nPlease use this code to verify your email address.`
        );

        res.status(200).json({ message: "Verification email sent. Please check your inbox.", token });
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const verifyEmail = async (req, res) => {
    const { token, verificationCode, fullName, email, password } = req.body;

    try {
        // Decode and verify the token
        const decoded = verifyEmailVerificationToken(token);

        if (decoded.verificationCode !== parseInt(verificationCode, 10)) {
            return res.status(400).json({ message: "Invalid verification code" });
        }

        // Check if the email matches the token
        if (decoded.email !== email) {
            return res.status(400).json({ message: "Email does not match the token" });
        }

        // Check if the user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email is already verified" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save the user to the database
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        // Generate a JWT token for the verified user
        const jwtToken = generateToken(newUser._id, res);

        res.status(201).json({
            message: "Email verified and account created successfully.",
            token: jwtToken,
        });
    } catch (error) {
        console.error("Error in verifyEmail controller:", error.message);
        if (error.message === "Invalid or expired verification token") {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        });

    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server error" });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Please upload a profile picture" });
        }

        const upload = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await user.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });
        res.status(200).json(updatedUser);

    } catch (error) {
        console.log("Error in updateProfile controller", error.message);
        res.status(500).json({ message: "Internal Server error" });
    }
};

export const checkAuth = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server error" });
    }
};