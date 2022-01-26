const mongoose = require("mongoose");

const verificationSchema = mongoose.Schema(
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

const Verification = mongoose.model("Verification", verificationSchema);

module.exports = Verification;
