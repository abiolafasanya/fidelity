const jwt = require("jsonwebtoken");
const path = require("path");
const { findOne } = require(path.resolve("utils/helpers"));
const bcrypt = require("bcrypt");
const model = require("./model");
require("dotenv").config();
const { SECRET } = process.env || "mysecret";

exports.dashboard = async (req, res) => {
  let message = await req.flash("info");
  let user = await findOne({id: await req.user});
  const { id, first_name, last_name, role, username, isAdmin, isTeacher } =
    user;
    console.log("dashboard : ", {user}, req.user)
  let data = { id, first_name, last_name, username, role, isAdmin, isTeacher };
  res.render("pages/dashboard", { message, loggedIn: true, data });
};

exports.register = (req, res) => {
  res.render("pages/register", { loggedIn: false });
};

exports.createUser = async (req, res) => {
  let { first_name, last_name, username, classId, password, cpassword, role } =
    req.body;
  //  console.log(req.body)
  if (password !== cpassword) {
    res.status(400).json({ ok: false, message: "password do not match" });
  }
  if (password.length < 8) {
    res
      .status(400)
      .json({ ok: false, message: "password must be 8 character and above" });
  }
  // let photo = req.file === undefined || null ? "nopic.jpg" : req.file.filename;
  let isAdmin = role == "admin" ? true : false;
  let isTeacher = role == "teacher" ? true : false;
  password = bcrypt.hashSync(password, 10);
  role = role == null ? "student" : role;
  let data = {
    first_name,
    last_name,
    username,
    classId,
    password,
    isAdmin,
    isTeacher,
    role,
  };
  let user = await model.register(data);
  if (user) {
    let message = "Registered Successfully";
    await req.flash("loggedIn", false);
    await req.flash("info", message);
    res.status(200).redirect("/user/login");
  } else {
    let message = "Registration failed";
    await req.flash("loggedIn", false);
    await req.flash("info", message);
    await req.flash("messages");
    res.status(500).redirect("/login");
  }
};

exports.loginPage = async (req, res) => {
  let message = await req.flash().error || [];
  res.render("pages/login", { ok: true, message, loggedIn: false });
};

exports.getUsers = async (req, res) => {
  let users = await model.getAll();
  if (users.length > 0) {
    res.status(200).json({ data: users });
  } else res.status(404).json("no data");
};

exports.login = async (req, res, next) => {
  console.log("logging in process");
  console.log(req.body);
  next();
};

exports.logout = async (req, res) => {
  console.log("logging in process");
  req.logOut();
  res.redirect("/login");
};
