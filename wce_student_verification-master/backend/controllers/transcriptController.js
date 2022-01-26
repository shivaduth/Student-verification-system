const asyncHandler = require("express-async-handler");
const Transcript = require("../models/transcriptModel");
const User = require("../models/userModel");

const orderTranscript = asyncHandler(async (req, res) => {
  const { fname, lname, prn, dob, cpi, year } = req.body;
  let isVerified = true;
  if (!fname || !lname || !prn || !dob || !cpi || !year) {
    res.status(400);
    throw new Error("All fields are required");
  } else {
    const transcriptData = await Transcript.find({ prn, year });
    if (transcriptData.length !== 0) {
      res.status(400);
      throw new Error("Order Already Exists");
    } else {
      const requestUser = await User.findOne({ _id: req.user._id });
      console.log(requestUser);
      const transcript = new Transcript({
        user: `Name: ${requestUser.name}  Email: ${requestUser.email}`,
        fname,
        lname,
        prn,
        year,
        dob,
        cpi,
      });

      const data = await transcript.save();
      res.status(201).json(data);
    }
  }
});

const viewTranscript = asyncHandler(async (req, res) => {
  const transcriptData = await Transcript.find();
  if (transcriptData.length == 0) {
    res.status(400);
    throw new Error("No Transcript Found");
  }
  res.status(201).json(transcriptData);
});

const approveTranscript = asyncHandler(async (req, res) => {
  const prn = req.params.prn;
  const year = req.params.year;
  console.log(prn);
  if (!prn || !year) {
    res.status(400);
    throw new Error("Error Getting PRN");
  } else {
    const updateData = await Transcript.updateOne(
      { prn, year },
      { status: true }
    );
    const transcriptData = await Transcript.find({ prn, year });
    console.log(transcriptData);
    res.status(201).json(transcriptData[0]);
  }
});

const deleteTranscript = asyncHandler(async (req, res) => {
  const prn = req.params.prn;
  const year = req.params.year;
  console.log(prn, year);
  if (!prn || !year) {
    res.status(400);
    throw new Error("Enter Getting PRN");
  } else {
    const updateData = await Transcript.deleteOne({ prn, year });
    const transcriptData = await Transcript.find({ prn, year });
    res.status(201).json(transcriptData);
  }
});

module.exports = {
  orderTranscript,
  viewTranscript,
  approveTranscript,
  deleteTranscript,
};
