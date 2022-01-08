const jwt = require("jsonwebtoken");
const path = require("path");
const { findOne, countUser } = require(path.resolve("utils/helpers"));
const bcrypt = require("bcrypt");
const model = require("./model");
require("dotenv").config();
const { SECRET } = process.env || "mysecret";

exports.dashboard = async (req, res) => {
  let message = await req.flash("info");
  let data = await findOne({ id: await req.user });
  console.log({ user_data: data });

  res.render("pages/dashboard", { message, loggedIn: true, data });
};

exports.index = (req, res) => {
  res.render("pages/index", { loggedIn: false });
};

exports.register = async (req, res) => {
  let count = await countUser();
  res.render("pages/register", { loggedIn: false, count: count.length + 1 });
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
    res.status(200).redirect("/login");
  } else {
    let message = "Registration failed";
    await req.flash("loggedIn", false);
    await req.flash("info", message);
    await req.flash("messages");
    res.status(500).redirect("/login");
  }
};

exports.loginPage = async (req, res) => {
  let message = (await req.flash().error) || [];
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

exports.dash = async (req, res) => {
  let message = await req.flash();
  let id = { id: await req.user }
  let data = await findOne({ id: await req.user });
  let assignments = await model.getAssignments();
  let {user_id} = assignments[0]
  console.log({ data, message, assignments, assignmentId: user_id });
  const ass = assignments.filter(
    (ass) => ass.user_id === id.id);
  console.log("assignment Id: ", ass);
  res.render("pages/dashboards", {
    title: "Dashobard",
    message,
    loggedIn: true,
    data,
    assignments: ass,
  });
};
