const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const router = require("./src/routes/api")
const app = express();
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const mongoSanitize = require("express-mongo-sanitize");
const dotenv = require("dotenv");
dotenv.config({path:"./config.env"});

const allowedOrigins = ["http://localhost:5174","http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error("Not allowed by CORS")); // Reject the request
      }
    },
    credentials: true,
  })
);

app.use(helmet());
app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.query) mongoSanitize.sanitize(req.query);
  if (req.params) mongoSanitize.sanitize(req.params);
  next();
});
app.use(hpp());
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const limiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 2000 }); // 10 minutes
app.use(limiter);


const OPTION = { user: "", pass: "", autoIndex: true };
mongoose
  .connect(process.env.URI, OPTION)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.error("MongoDB Connection Error:", error);
  });

app.set("etag", false);

app.use("/api", router);

app.get("/", (req, res) => res.send("Server Is Running"));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Page not found",
  });
});

module.exports = app;
