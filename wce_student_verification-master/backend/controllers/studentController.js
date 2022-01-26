const Student = require("../models/studentModel");
const asyncHandler = require("express-async-handler");
const student = require("../models/studentModel");

const viewStudent = asyncHandler(async (req, res) => {
  const { branch, prn } = req.body;
  if (branch !== "" && prn !== "" && branch !== "Select Branch") {
    const studentData = await Student.find({ prn, branch });
    res.status(201).json(studentData);
  } else if (prn == "" && (branch == "" || branch == "Select Branch")) {
    const studentData = await Student.find();
    res.status(201).json(studentData);
  } else if ((branch == "" || branch == "Select Branch") && prn !== "") {
    const studentData = await Student.find({ prn });
    res.status(201).json(studentData);
  } else if (branch !== "" && branch !== "Select Branch" && prn == "") {
    const studentData = await Student.find({ branch });
    res.status(201).json(studentData);
  } else {
    res.status(400);
    throw new Error("Unexpected Error");
  }
});

const addStudent = asyncHandler(async (req, res) => {
  const { fname, lname, prn, dob, branch } = req.body;

  if (!fname || !lname || !prn || !dob || !branch) {
    res.status(400);
    throw new Error("All field are required");
  } else {
    const student_data = await Student.find({ prn });

    if (student_data.length !== 0) {
      res.status(400);
      throw new Error("Student Already Exists");
    }
    const student = new Student({
      fname,
      lname,
      prn,
      dob,
      branch,
    });

    const saveStudent = await student.save();
    res.status(201).json(saveStudent);
  }
});

const addCourse = asyncHandler(async (req, res) => {
  const { prn, year, coursename, coursecode, credit, grade } = req.body;

  if (!prn || !coursename || !coursecode || !credit || !grade || !year) {
    res.status(400);
    throw new Error("All fields are required");
  } else {
    const studentData = await Student.find({ prn });
    if (studentData.length !== 0) {
      const newCourse = {
        year,
        coursename,
        coursecode,
        credit,
        grade,
      };
      const courseData = studentData[0].courseDetails;
      courseData.forEach((element) => {
        if (
          coursecode == element.coursecode ||
          coursename == element.coursename
        ) {
          res.status(400);
          throw new Error("Course Already Exists");
        }
      });
      const updateData = await Student.updateOne(
        { prn },
        { $push: { courseDetails: newCourse } }
      );
      const data = await Student.find({
        prn,
        "courseDetails.coursename": coursename,
      });

      res.status(201).json(data);
    } else {
      res.status(400);
      throw new Error("Student Does not exists");
    }
  }
});

const updateCourse = asyncHandler(async (req, res) => {
  const { prn, year, coursecode, grade } = req.body;
  let flag = false;
  if (!prn || !year || !coursecode || !grade) {
    res.status(400);
    throw new Error("All fields are required.");
  } else {
    const studentData = await Student.find({
      prn,
      "courseDetails.coursecode": coursecode,
    });
    if (studentData.length == 0) {
      res.status(400);
      throw new Error("Student Doesn't Exists");
    }
    const courseData = studentData[0].courseDetails;
    courseData.forEach((ele) => {
      if (ele.coursecode == coursecode) {
        flag = true;
      }
    });

    if (flag) {
      const updateCourse = await Student.updateOne(
        { prn, "courseDetails.coursecode": coursecode },
        {
          $set: { "courseDetails.$.grade": grade },
        }
      )
        .then((data) => {
          if (data) {
            res.status(201).json({ msg: "Course Details Updated" });
          }
        })
        .catch((error) => {
          if (error) {
            res.status(400);
            throw new Error(error);
          }
        });
      const data = await Student.find({ prn });
    } else {
      res.status(400);
      throw new Error("Course Doesn't Exists");
    }
  }
});

const deleteCourse = asyncHandler(async (req, res) => {
  const { prn, coursecode } = req.body;
  let flag = false;
  if (!prn || !coursecode) {
    res.status(400);
    throw new Error("All fields are required.");
  } else {
    const studentData = await Student.find({ prn });
    if (studentData.length == 0) {
      res.status(400);
      throw new Error("No Student Details Exists.");
    }
    const courseData = studentData[0].courseDetails;
    courseData.forEach((item) => {
      if (item.coursecode == coursecode) {
        flag = true;
      }
    });
    if (flag) {
      const updateData = await Student.updateOne(
        { prn },
        { $pull: { courseDetails: { coursecode } } }
      )
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          res.status(400);
          throw new Error(err);
        });
      const currData = await Student.find({
        prn,
        "courseDetails.coursecode": coursecode,
      });
      res.status(201).json(currData);
    }
    res.status(400);
    throw new Error("No Such Course Details Exists.");
  }
});

const deleteStudent = asyncHandler(async (req, res) => {
  const { prn } = req.body;
  if (!prn) {
    res.status(400);
    throw new Error("Enter PRN");
  }
  const data = await Student.findOne({ prn });
  if (!data) {
    res.status(400);
    throw new Error("Student Doesn't Exists ");
  } else {
    const deleteData = Student.deleteOne({ prn })
      .then((data) => {
        res.status(201).json({ msg: "Deleted Successfully" });
      })
      .catch((err) => {
        res.status(400);
        throw new Error(err);
      });
  }
});

const checkStudent = asyncHandler(async (req, res) => {
  const { prn } = req.body;
  if (!prn) {
    res.status(400);
    throw new Error("Enter PRN");
  } else {
    const studentData = await Student.find({ prn });
    if (studentData.length == 0) {
      res.status(400);
      throw new Error("Student Does not Exists");
    } else {
      res.status(201).json(studentData);
    }
  }
});

const getCourse = asyncHandler(async (req, res) => {
  const { prn } = req.body;
  if (!prn) {
    res.status(400);
    throw new Error("Error Getting PRN");
  } else {
    const studentData = await Student.find({ prn });
    if (studentData.length == 0) {
      res.status(400);
      throw new Error("Student Does not Exists");
    } else {
      res.status(201).json([studentData[0].courseDetails, studentData]);
    }
  }
});

module.exports = {
  viewStudent,
  addStudent,
  addCourse,
  deleteStudent,
  deleteCourse,
  updateCourse,
  checkStudent,
  getCourse,
};
