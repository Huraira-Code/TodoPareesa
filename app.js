const dotenv = require("dotenv");
require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./db/db_connection");
const router = require("./routes/route");
const authenticationMiddleware = require("./middleware/authentication");
const cors = require("cors"); // <-- Added
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // <-- Allow any site to access

// Database Connection
connectDB();

app.use("/", router);
app.use("/api/v1/", authenticationMiddleware, router);

app.get("/", (req, res) => {
  res.send("First page");
});

app.listen(port, () =>
  console.log(`Server is running at: http://localhost:${port}`)
);
