const express = require("express");
const {
  viewStudent,
  addStudent,
  addCourse,
  deleteStudent,
  deleteCourse,
  updateCourse,
  checkStudent,
  getCourse,
} = require("../controllers/studentController");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");

router.route("/view").post(protect, viewStudent);
router.route("/check").post(protect, checkStudent);
router.route("/getcourse").post(protect, getCourse);
router.route("/add").post(protect, addStudent);
router.route("/addcourse").put(protect, addCourse);
router.route("/updatecourse").put(protect, updateCourse);
router.route("/deletecourse").put(protect, deleteCourse);
router.route("/delete").post(protect, deleteStudent);

module.exports = router;
