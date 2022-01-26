const express = require("express");
const { registerUser, authUser } = require("../controllers/userController");

//creating router
const router = express.Router();

//different routes
router.route("/register").post(registerUser);
router.route("/login").post(authUser);

module.exports = router;
