const joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const model = require("./model");
require("dotenv").config();
const { SECRET } = process.env || "mysecret";

exports.superAdmin = async (req, res) => {
  let user = {
    username: "admin",
    password: bcrypt.hashSync("admin@01", 10),
    isAdmin: true,
    role: "superAdmin",
  };
  let create = await model.create(user);
  if (create) res.status(200).json("super admin created");
  else res.status(400).json("super admin not created");
};

exports.dashboard = async (req, res) => {
  let message = await req.consumeFlash("info");
  res.render("admin/dashboard", { message, loggedIn: true });
};

exports.register = (req, res) => {
  res.render("admin/register", { loggedIn: true });
};

exports.createUser = async (req, res) => {
  const schema = joi.object({
    username: joi.string().min(3).max(30).required(),
    password: joi.string().min(8).required(),
    cpassword: joi.ref("password"),
    role: joi.string(),
    gender: joi.string(),
  });

  let input = await schema.validateAsync(req.body);
  let { username, password, role } = input;

  let isAdmin = role == "admin" ? true : false;
  let isTeacher = role == "teacher" ? true : false;
  password = bcrypt.hashSync(password, 10);
  let data = { username, password, role, isAdmin, isTeacher };
  let user = await model.create(data);
  if (user) {
    res.status(200).json({ ok: true, message: "user created" });
  } else {
    res.status(500).json({ ok: false, message: "user not created" });
  }
  console.log(user);
};

exports.getUsers = async (req, res) => {
  let users = await model.getAll();
  if (users.length > 0) {
    res.status(200).json({ data: users });
  } else res.status(404).json("no data");
};

/**
 * @route create table /user/generateTable
 */
exports.createTable = async (req, res) => {
  try {
    let create = await model.up();
    if (create) {
      res.send("table created");
    } else {
      res.send("error: table not created");
    }
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

exports.removeTable = async (req, res) => {
  let remove = await model.down();
  if (remove) {
    res.send("table dropped");
  } else {
    res.send("error: table not removed");
  }
};
