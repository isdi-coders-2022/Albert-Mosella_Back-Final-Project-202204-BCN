const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const debug = require("debug")("rustik:userControllers");
const chalk = require("chalk");
const User = require("../../database/model/User");

const registerUser = async (req, res, next) => {
  const { name, username, password } = req.body;

  const queryFind = { username };
  const user = await User.findOne(queryFind);

  if (user) {
    const error = new Error();
    error.customMessage = "User already exists";
    error.statusCode = 409;
    next(error);
  }

  try {
    const encryptPassword = await bcrypt.hash(password, 10);

    const queryCreate = {
      username,
      password: encryptPassword,
      name,
    };

    await User.create(queryCreate);

    debug(chalk.green("User created"));
    res.status(201).json({ msg: "User created" });
  } catch (error) {
    error.statusCode = 400;
    debug(chalk.red("Bad request"));
    error.message = "Bad request";
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const queryFindOne = {
      username,
    };

    const user = await User.findOne(queryFindOne);

    if (user) {
      const checkPassword = await bcrypt.compare(password, user.password);

      if (checkPassword) {
        const userData = {
          name: user.name,
          username: user.username,
        };

        const token = jsonwebtoken.sign(userData, process.env.JWT_SECRET);

        res.status(200).json({ token });
      } else {
        const error = new Error();
        error.statusCode = 401;
        error.customMessage = "Incorrect username or password";
        next(error);
      }
    } else {
      const error = new Error();
      error.statusCode = 401;
      error.customMessage = "Incorrect username or password";
      next(error);
      return;
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser };
