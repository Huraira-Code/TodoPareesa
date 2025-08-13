const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Define schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minLength: [3, "name must be at least 3 characters"],
      maxLength: [20, "name should not be greater than 20 characters"],
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      trim: true,
    },
    contact: {
      type: Number, // Fixed from lowercase "number" to proper "Number"
      required: [true, "contact number is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [8, "password must be at least 8 characters"],
      select: false,
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
    verfiy: {
      type: Boolean,
      default: false,
    },
    verifyEmailToken: String,
    verifyEmailExpiry: Date,
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  { timestamps: true }
);

// Pre-save hook for password hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Instance methods
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role, email: this.email },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRY }
  );
};

userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

userSchema.methods.generateForgotPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

  return resetToken;
};

userSchema.methods.generateVerifyEmailToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.verifyEmailToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.verifyEmailExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

  return resetToken;
};

// Create and export model
const User = model("User", userSchema);
module.exports = User;
