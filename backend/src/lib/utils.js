import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.cookie('jwt', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true, // cookie cannot be accessed by client side javascript
        sameSite: 'strict', // cookie is not sent with cross-origin requests
        secure: process.env.NODE_ENV === 'production' ? true : false,
    });
}

// Generate a short-lived token for email verification
export const generateEmailVerificationToken = (email, verificationCode) => {
    return jwt.sign(
        { email, verificationCode },
        process.env.JWT_SECRET,
        { expiresIn: "15m" } // Token expires in 15 minutes
    );
};

// Verify the email verification token
export const verifyEmailVerificationToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error("Invalid or expired verification token");
    }
};