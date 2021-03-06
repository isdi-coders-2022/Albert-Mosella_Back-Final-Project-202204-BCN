const chalk = require("chalk");
const debug = require("debug")("rustik:propertyControllers");
const Property = require("../../database/model/Property");

const getProperties = async (req, res) => {
  debug(chalk.green("Properties request received"));
  const properties = await Property.find();
  res.status(200).json(properties);
};

const deleteProperty = async (req, res) => {
  debug(chalk.green("Request to delete a property received"));
  const { idProperty } = req.params;
  await Property.findByIdAndDelete(idProperty);
  res.status(200).json({ msg: `The property has been deleted` });
};

const createProperty = async (req, res) => {
  debug(chalk.green("Request to create a property received"));
  const property = req.body;
  const newProperty = await Property.create(property);
  res.status(201).json(newProperty);
};

const editProperty = async (req, res) => {
  debug(chalk.yellowBright("Request to edit a property received"));
  const { idProperty } = req.params;
  const property = req.body;
  await Property.findByIdAndUpdate({ _id: idProperty }, property);
  res.status(200).json(property);
};

const getOneProperty = async (req, res) => {
  const { idProperty } = req.params;
  const property = await Property.findById(idProperty);
  debug(chalk.green("Request to get one property received"));
  res.status(200).json(property);
};

module.exports = {
  getProperties,
  deleteProperty,
  createProperty,
  editProperty,
  getOneProperty,
};
