const express = require("express");
const app = express();
const connectDB = require("./config/database");
const validateSignupData = require("../src/utils/validation");
const cors = require("cors");

const cookieParser = require("cookie-parser");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Database Connected...!");

    app.listen(7777, () => {
      console.log("Server running on port:7777");
    });
  })
  .catch((err) => {
    console.error("Database cant connect...!");
  });
