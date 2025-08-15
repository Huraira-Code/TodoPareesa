const User = require("../models/user_model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const cloudinary = require("cloudinary");
const crypto = require("crypto");
const { verifyUserMail } = require("../utils/mail.utils");

// SIGN UP
const handleUserSignUp = async (req, res) => {
  console.log(req.body);
  const { name, email, contact, password } = req.body;

  if (!name || !email || !password) {
    if (req.file) fs.rmSync(`uploads/${req.file.filename}`);
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  if (password.length < 8) {
    if (req.file) fs.rmSync(`uploads/${req.file.filename}`);
    return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
  }

  if (name.length < 3 || name.length > 30) {
    if (req.file) fs.rmSync(`uploads/${req.file.filename}`);
    return res.status(400).json({ success: false, message: "Name must be between 3 and 30 characters" });
  }

  const isUserExist = await User.findOne({ email });
  const isNameExist = await User.findOne({ name });

  if (isUserExist) {
    if (req.file) fs.rmSync(`uploads/${req.file.filename}`);
    return res.status(400).json({ success: false, message: "Email already in use" });
  }

  if (isNameExist) {
    if (req.file) fs.rmSync(`uploads/${req.file.filename}`);
    return res.status(400).json({ success: false, message: "Name already taken" });
  }

  const user = await User.create({
    name,
    email,
    password,
    contact,
    avatar: {
      public_id: email,
      secure_url: "https://cdn3.iconfinder.com/data/icons/avatars-round-flat/33/man5-512.png",
    },
  });

  if (!user) {
    return res.status(400).json({ success: false, message: "User registration failed" });
  }

  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms",
        width: 200,
        height: 200,
        crop: "fill",
        gravity: "faces",
      });

      if (result) {
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;
      }

      fs.rmSync(`uploads/${req.file.filename}`);
    } catch (error) {
      return res.status(500).json({ success: false, message: "File uploading error: " + error.message });
    }
  }

  await user.save() 
  user.password = undefined;
  const token = await user.generateAuthToken();

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    token,
  });
};

// LOGIN
const handleUserLogin = async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email }).select("+password"); // explicitly select password
    if (!user) {
      return res.status(404).json({ success: false, message: "Email or password is incorrect" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Email or password is incorrect" });
    }

    const token = user.generateAuthToken();
    user.password = undefined; // remove password before sending

    res.status(200).json({
      success: true,
      message: "Successfully logged in",
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// VERIFY REGISTRATION
const VerifyRejistration = async (req, res) => {
  console.log("body:", req.body);

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  let user;
  try {
    user = await User.findOne({ email });
    console.log("User found:", !!user);
  } catch (err) {
    console.error("Error fetching user from DB:", err);
    return res.status(500).json({ success: false, message: "Database error" });
  }

  if (!user) {
    return res.status(200).json({ success: true, message: "If the email exists, a verification link will be sent" });
  }

  let resetToken;
  try {
    resetToken = user.generateVerifyEmailToken();
    console.log("Generated reset token:", resetToken);
  } catch (err) {
    console.error("Error generating reset token:", err);
    return res.status(500).json({ success: false, message: "Could not generate verification token" });
  }

  const resetTokenLink = resetToken;

  try {
    console.log("Sending verification email to:", email);
    await verifyUserMail(email, resetTokenLink);
  } catch (error) {
    console.error("Error sending email:", error);
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    return res.status(500).json({ success: false, message: "Email could not be sent. Please try again later." });
  }

  try {
    await user.save();
    console.log("User saved successfully");
  } catch (err) {
    console.error("Error saving user:", err);
    return res.status(500).json({ success: false, message: "Could not save user changes" });
  }

  res.status(200).json({ success: true, message: "Verification request sent to user mail" });
};


// COMPLETE VERIFICATION
const CompleteVerification = async (req, res) => {
  console.log(req.body)
  const { resetToken } = req.body;
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  const user = await User.findOne({
    verifyEmailToken: hashedToken,
    verifyEmailExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ success: false, message: "Invalid token or token expired" });
  }

  user.verfiy = true;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  await user.save();
  res.status(200).json({
    success: true,
    message: "Verification successful",
    role: user.role,
  });
};

module.exports = {
  handleUserSignUp,
  handleUserLogin,
  VerifyRejistration,
  CompleteVerification,
};
