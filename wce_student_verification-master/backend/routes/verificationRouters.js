const express = require("express");
const protect = require("../middlewares/authMiddleware.js");
const {
  verifyStudent,
  getBlockchain,
  saveVerificationHistory,
  getVerificationHistory,
} = require("../controllers/verificationController");
const router = express.Router();

router.route("/verify").post(protect, verifyStudent);
router.route("/savehistory").post(protect, saveVerificationHistory);
router.route("/gethistory").post(protect, getVerificationHistory);
router.route("/getBlockchain").get(getBlockchain);

module.exports = router;
