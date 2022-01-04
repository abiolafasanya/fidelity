const joi = require("joi");
const path = require("path");
const { findOne } = require(path.resolve("utils/helpers"));
const bcrypt = require("bcrypt");
const model = require("./model");
require("dotenv").config();
const { SECRET } = process.env || "mysecret";

exports.superAdmin = async (req, res) => {
  let user = {
    username: "admin",
    first_name: "adminstrator",
    last_name: " ",
    password: bcrypt.hashSync("admin@01", 10),
    isAdmin: true,
    role: "superAdmin",
  };
  let create = await model.create(user);
  if (create) res.status(200).json("super admin created");
  else res.status(400).json("super admin not created");
};

exports.dashboard = async (req, res) => {
  let message = await req.flash();
  let data = await findOne({id: await req.user});

  res.render("admin/index", { message, loggedIn: true, data });
};

exports.register = async (req, res) => {
  let message = await req.flash("info")
  res.render("admin/register", { loggedIn: true, message });
};

exports.createUser = async (req, res) => {
  const schema = joi.object({
    first_name: joi.string().min(3).max(30).required(),
    last_name: joi.string().min(3).max(30).required(),
    username: joi.string().min(3).max(30).required(),
    password: joi.string().min(8).required(),
    cpassword: joi.ref("password"),
    role: joi.string(),
    gender: joi.string(),
    classId: joi.string(),
  });

  let input = await schema.validateAsync(req.body);
  let { first_name, last_name, username, password, role, classId } = input;

  let isAdmin = role == "admin" ? true : false;
  let isTeacher = role == "teacher" ? true : false;
  classId = classId == '' ? null : classId
  password = bcrypt.hashSync(password, 10);
  let data = { first_name, last_name, username, password, role, isAdmin, isTeacher, classId};
  let user = await model.create(data);

  if (user) {
    let message = "User Created Successfully";
    await req.flash("loggedIn", false);
    await req.flash("info", message);
    res.status(200).redirect("/admin/create-user");
  } else {
    let message = "User creation failed";
    await req.flash("loggedIn", false);
    await req.flash("info", message);
    await req.flash("messages");
    res.status(500).redirect("/admin/create-user");
  }
  console.log(user);
};

exports.getUsers = async (req, res) => {
  let users = await model.getAll();
  if (users.length > 0) {
    res.status(200).json({ data: users });
  } else res.status(404).json("no data");
};

exports.update = async (req, res) => {
  let message = req.flash()
  res.render("admin/update", {loggedIn: true, message})
}

exports.student = async (req, res) => {
  let message = req.flash()
  res.render("admin/update", {loggedIn: true, message})
}

exports.teacher = async (req, res) => {
  let message = req.flash()
  res.render("admin/update", {loggedIn: true, message})
}

exports.profile = async (req, res) => {
  let message = req.flash()
  res.render("admin/update", {loggedIn: true, message})
}