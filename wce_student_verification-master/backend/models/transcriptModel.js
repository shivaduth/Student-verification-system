const mongoose = require("mongoose");

const transcriptSchema = mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
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
    year: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    cpi: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Transcript = mongoose.model("Transcript", transcriptSchema);

module.exports = Transcript;
