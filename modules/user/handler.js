const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const model = require("./model");
require("dotenv").config();
const { SECRET } = process.env || "mysecret";


exports.dashboard = async (req, res) => {
  let message = await req.consumeFlash("info");
  res.render("pages/dashboard", { message });
};

exports.register = (req, res) => {
  res.render("pages/register");
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
  res.render("pages/login", { ok: true, message });
};

exports.getUsers = async (req, res) => {
  let users = await model.getAll();
  if (users.length > 0) {
    res.status(200).json({ data: users });
  } else res.status(404).json("no data");
};

// exports.login = async (req, res, next) => {
//   let { password, username } = req.body;
//   console.log(password, username);
//   let user = await model.login({ username });
//   if (!user || user == undefined || user == null) {
//     let message = "user not found";
//     req.flash("info", message);
//     return res.status(404).redirect("/user/login");
//   } else {
//     console.log(user);
//     let dbPwd = user.password || user[0].password;
//     console.log({ db_password: dbPwd });
//     let isPassword = bcrypt.compareSync(password, dbPwd);
//     if (!isPassword) {
//       console.log(false, "failed");
//       res.status(400).json({
//         ok: false,
//         message: "Incorrect Password, User Login failed",
//       });
//     }
//     console.log("payload area");
//     const payload = {
//       id: user.id,
//       name: user.name,
//       isAdmin: user.isAdmin,
//       isTeacher: user.isTeacher,
//       loggedIn: true,
//     };
//     const token = jwt.sign(payload, SECRET, { expiresIn: 86400 });
//     let tokenUpdate = await model.updateToken(user.id, { token: token });

//     if (tokenUpdate) {
//       let message = { info: "Assignment Submitted", token };
//       console.log(message);
//       await req.flash("info", message);
//       res.redirect("/user/dashboard");
//     } else
//       res.status(500).json({ ok: false, message: "token genration failed" });
//   }
//   next()
// };

exports.logins = async (req, res, next) => {
  let { password, username } = req.body;
  console.log(password, username);
  if(username == '' || password == '') console.log('error')
  // next()
  passport.authenticate("local", {
    successRedirect: "/user/results",
    failureRedirect: "/user/login",
    failureFlash: true,
  });
};

exports.login = async (req, res, next) => {
  console.log(req.headers);
  console.log(req.body);
  next();
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
