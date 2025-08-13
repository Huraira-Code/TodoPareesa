const express = require("express");
const { upload } = require("../middleware/multer.js");

const {
  handleUserSignUp,
  handleUserLogin,
  VerifyRejistration,
  CompleteVerification,
} = require("../controllers/user_controller");
const router = express.Router();

// Sign UP & Login

router.route("/signUp").post(handleUserSignUp)
router.route("/login").post(handleUserLogin);
router.route("/VerifyRejistration").post(VerifyRejistration);
router.route("/CompleteVerification").post(CompleteVerification);

module.exports = router;
