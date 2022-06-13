const express = require("express");
const app = express();
const ErrorHandler = require("./middleware/error")

const cookieParser = require("cookie-parser");

app.use(express.json());

app.use(cookieParser());


// routes imports
const user = require("./routes/userRoute");
const product = require("./routes/ProductRoute");
const order = require("./routes/OrderRoute");

app.use("/api/v1/", product);
app.use("/api/v1/", user);
app.use("/api/v1/", order);

// Error Handeling
app.use(ErrorHandler);


module.exports = app;