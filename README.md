# DocTime2
## `npm init --y`
## `touch index.js config.env app.js .gitignore`
## `mkdir src src/controllers src/middlewares src/models src/routes src/utility`
## `npm i body-parser cookie-parser cors dotenv express express-mongo-sanitize express-rate-limit helmet hpp mongoose  nodemon `
## `npm i axios bcrypt express-session form-data jsonwebtoken moment node-global-storage nodemailer uuid`

```javascript
//index.js

const app = require('./app');
const dotenv=require('dotenv')
dotenv.config({path:'./config.env'})

app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`)
})

```
```javascript
//app.js
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const router = require("./src/routes/api");
const app = express();
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const mongoSanitize = require("express-mongo-sanitize");

const allowedOrigins = ["http://localhost:5173", "https://health.bseba.com"];

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
app.use(mongoSanitize());
app.use(hpp());
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(cookieParser());

const limiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 2000 }); // 10 minutes
app.use(limiter);

const URI =
  "mongodb+srv://hamidbd2310:Hamid121@cluster0.asvkdue.mongodb.net/TT";
const OPTION = { user: "", pass: "", autoIndex: true };
mongoose
  .connect(URI, OPTION)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.error("MongoDB Connection Error:", error);
  });

app.set("etag", false);

app.use("/api", router);

app.get("/", (req, res) => res.send("Server Is Running"));

//404 Not Found
app.use("*", (req, res) =>
  res.status(404).json({
    success: false,
    message: "Page not found",
  })
);

module.exports = app;

```
```javascript
//app.js
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

const allowedOrigins = ["*","http://localhost:5173", "https://health.bseba.com"];

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

app.use(bodyParser.json());
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

```
```javascript

```
