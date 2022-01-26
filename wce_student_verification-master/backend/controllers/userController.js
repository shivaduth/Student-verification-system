const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  const userData = await User.findOne({ email });

  if (userData) {
    res.status(400);
    throw new Error("User Already Exists");
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id),
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("Something Went Wrong");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id),
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("Invalid Email or Password");
  }
});

module.exports = { registerUser, authUser };
