const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const model = require("./model");
require("dotenv").config();
const { SECRET } = process.env || "mysecret";

exports.dashboard = async (req, res) => {
  let message = await req.consumeFlash("info");
  res.render("pages/dashboard", { message, loggedIn: true });
};

exports.register = (req, res) => {
  res.render("pages/register", { loggedIn: false });
};

exports.createUser = async (req, res) => {
  let { first_name, last_name, classId, password, cpassword, role } = req.body;
  if (password !== cpassword) {
    res.status(400).json({ ok: false, message: "password do not match" });
  }
  // let photo = req.file === undefined || null ? "nopic.jpg" : req.file.filename;
  let isAdmin = role == "admin" ? true : false;
  let isTeacher = role == "teacher" ? true : false;
  password = bcrypt.hashSync(password, 10);
  let username = `${first_name} ${last_name}`;
  let data = { username, classId, password, isAdmin, isTeacher };
  let payload = { username };
  let user = await model.register(data);
  if (user) {
    let token = jwt.sign(payload, SECRET, { expiresIn: 3600 });
    res.status(200).json({ ok: true, message: "user created", token });
  } else {
    res.status(500).json({ ok: false, message: "user not created" });
  }
  console.log(user);
};

exports.loginPage = async (req, res) => {
  let message = await req.consumeFlash("info");
  res.render("pages/login", { ok: true, message, loggedIn: false });
};

exports.getUsers = async (req, res) => {
  let users = await model.getAll();
  if (users.length > 0) {
    res.status(200).json({ data: users });
  } else res.status(404).json("no data");
};

exports.login = async (req, res, next) => {
  // console.log(req.headers);
  console.log("logging in process");
  console.log(req.body);
  next();
};

exports.logout = async (req, res) => {
  console.log("logging in process");
  req.logOut();
  res.redirect("/user/login");
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
