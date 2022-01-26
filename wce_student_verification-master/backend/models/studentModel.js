const mongoose = require("mongoose");

const studentSchema = mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: true,
    },
    prn: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    courseDetails: [
      {
        year: String,
        coursename: String,
        coursecode: String,
        credit: String,
        grade: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const student = mongoose.model("student", studentSchema);

module.exports = student;
