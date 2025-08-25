const express = require("express");
const { upload } = require("../middleware/multer.js");

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  markInProgress,
  markCompleted,
} = require("../controllers/task_controller");
const router = express.Router();


const {
  handleUserSignUp,
  handleUserLogin,
  VerifyRejistration,
  CompleteVerification,
  viewProfile,
  changePassword,
  forgotPassword,
  verifyResetToken,
  changePasswordWithToken,
} = require("../controllers/user_controller");


// Sign UP & Login

router.route("/signUp").post(handleUserSignUp);
router.route("/login").post(handleUserLogin);
router.route("/VerifyRejistration").post(VerifyRejistration);
router.route("/CompleteVerification").post(CompleteVerification);
router.route("/viewProfile").post(viewProfile);
router.route("/changePassword").post(changePassword);
router.route("/forgetPassword").post(forgotPassword);
router.route("/verifyResetToken").post(verifyResetToken);
router.route("/changeForgetPassword").post(changePasswordWithToken);


//task route
router.route("/createTask").post(createTask);
router.route("/getTasks").post(getTasks);
router.route("/updateTask").post(updateTask);
router.route("/deleteTask").post(deleteTask);
router.route("/markInProgress").post(markInProgress);
router.route("/markCompleted").post(markCompleted);

module.exports = router;
