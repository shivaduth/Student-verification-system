const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRouter = require("./routes/userRouters");
const studentRouter = require("./routes/studentRouters");
const transcriptRouter = require("./routes/transcriptRouters.js");
const verificationRouter = require("./routes/verificationRouters");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const { getData } = require("../backend/controllers/verificationController");
dotenv.config();

getData();
//creating app
const app = express();

//Importing DB connection function
connectDB();

//setting up middleware
app.use(express.json());

//creating routes
app.use("/users", userRouter);
app.use("/student", studentRouter);
app.use("/transcript", transcriptRouter);
app.use("/verification", verificationRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server started running on PORT ${PORT}`);
});
