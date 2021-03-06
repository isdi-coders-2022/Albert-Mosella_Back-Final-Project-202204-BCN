const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const userRouter = require("./routers/userRouter");
const propertyRouter = require("./routers/propertyRouter");
const { notFoundError, generalError } = require("./middlewares/errors");

const app = express();

app.use(cors());
app.use(morgan("dev"));

app.use(express.static("uploads"));
app.use(express.json());

app.use("/users", userRouter);
app.use("/properties", propertyRouter);

app.use(notFoundError);
app.use(generalError);

module.exports = app;
