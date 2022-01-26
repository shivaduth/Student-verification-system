const Student = require("../models/studentModel");
const asyncHandler = require("express-async-handler");
const res = require("express/lib/response");
const User = require("../models/userModel");
const Block = require("../blockchain/Block");
const Blockchain = require("../blockchain/Blockchain");
const Verification = require("../models/verificationModel");

const block = new Block();
const blockchain = new Blockchain();

var chainData = [];

const getData = async () => {
  var chainData = [];
  var blockData = [];
  const studentData = await Student.find({});
  studentData.forEach((student, index) => {
    blockData.push(student.fname);
    blockData.push(student.lname);
    blockData.push(student.prn);
    var dsum = 0;
    var nsum = 0;
    var cpi = 0;
    student.courseDetails.forEach((item) => {
      switch (item.grade) {
        case "AA":
          nsum = nsum + 10 * item.credit;
          dsum = dsum + parseInt(item.credit);
          break;
        case "AB":
          nsum = nsum + 9 * item.credit;
          dsum = dsum + parseInt(item.credit);
          break;
        case "BB":
          nsum = nsum + 8 * item.credit;
          dsum = dsum + parseInt(item.credit);
          break;
        case "BC":
          nsum = nsum + 7 * item.credit;
          dsum = dsum + parseInt(item.credit);
          break;
        case "CC":
          nsum = nsum + 6 * item.credit;
          dsum = dsum + parseInt(item.credit);
          break;
        case "CD":
          nsum = nsum + 5 * item.credit;
          dsum = dsum + parseInt(item.credit);
          break;
        case "DD":
          nsum = nsum + 4 * item.credit;
          dsum = dsum + parseInt(item.credit);
          break;
        case "FF":
          nsum = nsum + 0 * item.credit;
          dsum = dsum + parseInt(item.credit);
          break;
        default:
          break;
      }
    });
    cpi = nsum / dsum;
    cpi = cpi.toFixed(2);
    // console.log(cpi);
    blockData.push(cpi);
    chainData.push(blockData);
    blockData = [];
  });

  chainData.forEach((data, index) => {
    blockchain.addBlock(new Block(index + 1, block.getDate(), data));
  });
  console.log(JSON.stringify(blockchain, null, 4));
  console.log("is chain valid ? ", blockchain.isChainValid());
};

const verifyStudent = asyncHandler(async (req, res) => {
  const { fname, lname, prn, cpi } = req.body;
  if (!fname || !lname || !prn || !cpi) {
    res.status(400);
    throw new Error("Please Fill Fields");
  } else {
    const data = await Student.find({ prn });
    if (data.length == 0) {
      res.status(400);
      throw new Error("Student Does not Exists");
    } else {
      var cnt = 0;
      blockchain.chain.forEach((item, index) => {
        item.data.forEach((it, ind) => {
          cnt = cnt + parseInt(ind);
          if (it == prn) {
            console.log(index);
            console.log(item.data[index]);
            if (
              item.data[0] == fname &&
              item.data[1] == lname &&
              item.data[3] == cpi &&
              blockchain.isChainValid()
            ) {
              res.status(201).json({ isVerified: true });
            } else {
              res.status(201).json({ isVerified: false });
            }
          }
        });
      });
    }
  }
});

const saveVerificationHistory = asyncHandler(async (req, res) => {
  const { fname, lname, prn, cpi, status } = req.body;
  console.log(fname, lname, prn, cpi, status);
  if (!fname || !lname || !prn || !cpi) {
    res.status(400);
    throw new Error("Not Getting Enough Value");
  } else {
    const requestUser = await User.findOne({ _id: req.user._id });
    console.log(requestUser);
    const verification = new Verification({
      user: `Name: ${requestUser.name}  Email: ${requestUser.email}`,
      fname,
      lname,
      prn,
      cpi,
      status,
    });

    const data = await verification.save();
    res.status(201).json(data);
  }
});
const getVerificationHistory = asyncHandler(async (req, res) => {
  const data = await Verification.find({});
  res.status(201).json(data);
});

const getBlockchain = asyncHandler(async (req, res) => {
  const chain = blockchain.chain;
  res.json({ chain });
});

module.exports = {
  verifyStudent,
  getData,
  getBlockchain,
  saveVerificationHistory,
  getVerificationHistory,
};
