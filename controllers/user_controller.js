const User = require("../models/user_model");
const uploadOnCloudinary = require("../utils/cloudinary.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendMail = require("../utils/nodemailer.js");
const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");
const VerificationToken = require("../models/verificationToken_model.js");
const { ImageAnnotatorClient } = require("@google-cloud/vision"); // For Google Cloud Vision OCR
const multer = require("multer"); // For handling file uploads
const upload = multer({ storage: multer.memoryStorage() }); // Store files in memory
const fs = require("fs"); // <--- Import Node.js File System module
const path = require("path"); // <--- Import Node.js Path module

process.env.GOOGLE_APPLICATION_CREDENTIALS =
  "./chemicalfinder-3872dc255a78.json";

const sendTokenMail = require("../utils/nodemailer.js");

// const createAndSendToken = async (userId, reciever) => {
//   const randomToken = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
//   const randomTokenString = String(randomToken); // Converts the number to a string

//   try {
//     // Check if userId already exists in the VerificationToken table
//     let existingToken = await VerificationToken.findOne({ owner: userId });
//     console.log(existingToken);
//     if (existingToken) {
//       // Update the existing token
//       try {
//         // Update the token value and save it to the database
//         existingToken.token = randomTokenString;
//         await existingToken.save(); // Save changes

//         // If saving is successful, proceed to send the email
//         await sendTokenMail(
//           "Reminder Application Token Provider",
//           randomTokenString,
//           reciever
//         );

//         return { status: "success" }; // Both operations succeeded
//       } catch (error) {
//         // Catch any errors during saving or email sending
//         return { status: "failed", msg: error.message };
//       }
//     } else {
//       try {
//         // Create a new verification token entry
//         const newToken = await VerificationToken.create({
//           owner: userId,
//           token: randomTokenString,
//         });

//         // If the token creation succeeds, proceed to send the email
//         await sendTokenMail(
//           "Reminder Application Token Provider",
//           randomTokenString,
//           reciever
//         );

//         return { status: "success" }; // Both operations succeeded
//       } catch (error) {
//         // Catch any errors during token creation or email sending
//         return { status: "failed", msg: error.message };
//       }
//     }
//   } catch (error) {
//     console.error("Error handling verification token:", error.message);
//     throw error; // Throw the error for further handling
//   }
// };

// const handleRepeatTokenSend = async (req, res) => {
//   const authHeader = req.headers.authorization;
//   const token = authHeader.split(" ")[1];
//   const verify = jwt.verify(token, process.env.JWT_SECRET);
//   console.log(verify);
//   try {
//     const createTokenResult = await createAndSendToken(
//       verify._id,
//       verify.email
//     );
//     res
//       .status(200)
//       .json({ msg: "Token have been succesfully sended to your email" });
//   } catch (error) {
//     res.status(404).json({ msg: error });
//   }
// };

// const VerifyToken = async (req, res) => {
//   const authHeader = req.headers.authorization;
//   const token = authHeader.split(" ")[1];
//   try {
//     const verify = jwt.verify(token, process.env.JWT_SECRET);
//     const id = verify._id;

//     const tokenEntry = await VerificationToken.findOne({ owner: id });
//     if (!tokenEntry) {
//       return res
//         .status(404)
//         .json({ status: "Error", msg: "Token entry not found" });
//     }

//     const sendedToken = req.body.token;
//     const validated = await bcrypt.compare(sendedToken, tokenEntry.token);
//     if (validated) {
//       // Update the user's verified field to true after successful validation
//       const updatedUser = await User.findOneAndUpdate(
//         { _id: id }, // Find the user by ID
//         { Verified: true }, // Set the verified field to true
//         { new: true } // Return the updated document
//       );

//       if (!updatedUser) {
//         return res.status(404).json({ status: "Error", msg: "User not found" });
//       }

//       return res.status(200).json({
//         status: "Matched Successfully",
//         msg: "You have entered the right code",
//         user: updatedUser,
//       });
//     } else {
//       return res.status(400).json({
//         status: "OTP Code Not Matched",
//         msg: "You have entered the wrong OTP Code",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       status: "Error",
//       msg: "An internal error occurred",
//       error: error.message,
//     });
//   }
// };

// const changeForgetPassword = async (req, res) => {
//   const password = req.body.password;
//   const email = req.body.email;

//   try {
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Update the user's password
//     const updatedUser = await User.findOneAndUpdate(
//       { email: email }, // Find user by email
//       { password: hashedPassword }, // Update the password
//       { new: true } // Return the updated document
//     );

//     if (!updatedUser) {
//       return res
//         .status(404)
//         .json({ status: "Error", msg: "User update failed" });
//     }

//     res.status(200).json({ msg: "Password have been succesfully changed" });
//   } catch (error) {
//     console.log(error);
//   }
// };

// const forgetPasswordSend = async (req, res) => {
//   console.log("hitting functions");
//   try {
//     const { email } = req.body; // Extract email from request body

//     // Find user by email
//     const user = await User.findOne({ email });

//     // Check if user exists
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     const createTokenResult = await createAndSendToken(user._id, user.email);
//     res.status(200).json(createTokenResult);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// const forgetPasswordChange = async (req, res) => {
//   try {
//     // Retrieve user by email (assuming email is provided in the request body)
//     const user = await User.findOne({ email: req.body.email });
//     if (!user) {
//       return res.status(404).json({ status: "Error", msg: "User not found" });
//     }

//     // Find the verification token associated with the user
//     const tokenEntry = await VerificationToken.findOne({ owner: user._id });
//     if (!tokenEntry) {
//       return res
//         .status(404)
//         .json({ status: "Error", msg: "Token entry not found" });
//     }

//     const sendedToken = req.body.token;
//     // Validate the token
//     console.log(sendedToken);
//     console.log(tokenEntry.token);
//     const validated = await bcrypt.compare(sendedToken, tokenEntry.token);
//     if (validated) {
//       return res.status(200).json({
//         status: "OTP MATCHED",
//         msg: "OTP Have Successfull mathced",
//       });
//     } else {
//       return res.status(400).json({
//         status: "OTP Code Not Matched",
//         msg: "You have entered the wrong OTP Code",
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       status: "Error",
//       msg: "An internal error occurred",
//       error: error.message,
//     });
//   }
// };

const handleUserSignUp = async (req, res) => {
  console.log(req.body);
  console.log(process.env.JWT_SECRET);
  try {
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    if (!name || !email || !password) {
      return res.status(401).json({ msg: "all fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ msg: "Email is already registered. Please Login " }); // 409 Conflict
    }

    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });
    if (user) {
      const { _id, name } = user;
      const token = jwt.sign({ _id, name }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      return res.json({ msg: "Succesfully Signed Up", token: token });
      console.log("a");
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({ msg: error });
  }
};

const handleUserLogin = async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ msg: "all fields are required" });
    }
    const user = await User.findOne({
      email: email,
    });
    const { _id, name } = user;
    if (user) {
      const validated = await bcrypt.compare(password, user.password);
      if (validated) {
        const token = jwt.sign({ _id, name }, process.env.JWT_SECRET, {
          expiresIn: "30d",
        });
        return res
          .status(200)
          .json({ msg: "Successfully logged in", token: token });
      } else {
        return res.status(401).json({ msg: "Email or password is incorrect" }); // 401 Unauthorized
      }
    } else {
      return res.status(404).json({ msg: "Email or password is incorrect" }); // 404 Not Found
    }
  } catch (error) {
    return res.status(500).json({ err: error.message }); // 500 Internal Server Error
  }
};


const VerifyRejistration = async (req, res) => {

  const { email } = req.body;

  if (!email) {
    return next(new AppError("email is required!", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    // For security, don't reveal if email exists or not
    return next(
      new AppError(
        "If a user with that email exists, a password reset email has been sent.",
        200
      )
    );
  }
  console.log("user", user);
  const resetToken = user.generateVerifyEmailToken(); // Assuming this method exists on userSchema

  // Construct the reset link including the dynamic databaseName
  const resetTokenLink = resetToken;

  try {
    await verifyUserMail(email, resetTokenLink); // Ensure mail utility can handle this URL
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false }); // Save without re-validating password
    console.error("Verify email send error:", error);
    return next(
      new AppError(`Email could not be sent. Please try again later.`, 500)
    );
  }

  await user.save(); // Save user with the token and expiry (assuming `generateForgotPasswordToken` updates these fields)
  res.status(200).json({
    success: true,
    message: "Verify request sent to user mail",
  });
};

const CompleteVerification = async (req, res) => {

  const { resetToken } = req.params;

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  console.log("Hashed Token:", hashedToken); // Log the hashed token for debugging
  const user = await User.findOne({
    verifyEmailToken: hashedToken,
    verifyEmailExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("invalid user or token is expire", 400));
  }

  user.verfiy = true; // Mongoose pre-save hook should handle hashing
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Verification successfully",
    role: user.role, // Return user role if needed
  });
};





module.exports = {
  handleUserSignUp,
  handleUserLogin,
  VerifyRejistration,
  CompleteVerification,
};
