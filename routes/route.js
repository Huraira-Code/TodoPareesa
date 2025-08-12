const express = require("express");
const upload = require("../middleware/multer.js");
const {
  handleUserSignUp,
  handleUserLogin,
  handleUserGoogleLogin,
  handleViewProfile,
  handleAddQuestion,
  changePassword,
  sendSupportEmail,
  sendDataToGPT,
  sendDataForRecommendation,
  forgetPasswordSend,
  handleRepeatTokenSend,
  // VerifyToken,
  forgetPasswordChange,
  // changeForgetPassword
} = require("../controllers/user_controller");
const router = express.Router();

// Sign UP & Login
router.route("/signUp").post(handleUserSignUp);
router.route("/login").post(handleUserLogin);
router.route("/verifyRejistration").post(VerifyRejistration);
router.route("/verificationComplete/:resetToken").post(CompleteVerification);





// router.route("/googlelogin").post(handleUserGoogleLogin);
// router.route("/viewProfile").post(handleViewProfile);
// router.route("/handleAddQuestion").post(handleAddQuestion);
// router.route("/changePassword").post(changePassword);
// router.route("/support").post(sendSupportEmail);
// router.route("/sendDataToGPT").post(upload.single('file'), sendDataToGPT);
// router.route("/sendDataForRecommendation").post(sendDataForRecommendation);
// router.route("/forgetPasswordSend").post(forgetPasswordSend);
// router.route("/SendRepeatToken").post(handleRepeatTokenSend);
// // router.route("/verifyToken").post(VerifyToken);
// router.route("/forgetPasswordChange").post(forgetPasswordChange);
// router.route("/forgetPasswordSend").post(forgetPasswordSend);
// router.route("/changePassword").post(changePassword);
// router.route("/changeForgetPassword").post(changeForgetPassword);

module.exports = router;
