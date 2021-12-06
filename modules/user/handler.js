const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const model = require("./model");
require("dotenv").config();
const { SECRET } = process.env || "mysecret";

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

exports.loginPage = (req, res) => {
  res.render("pages/login");
};

exports.getUsers = async (req, res) => {
    let users= await model.getAll()
    if(users.length > 0) {
        res.status(200).json({data: users})
    }
    else res.status(404).json('no data')
}

exports.login = async (req, res) => {
  let { username, password } = req.body;
  let user = await model.login(username);
  if (user.length > 0) {
    let isPassword = bcrypt.compareSync(password, user.password);
    if (isPassword) {
      let payload = { user };
      let token = await jwt.sign(payload, SECRET, { expiresIn: 3600 });
      res.status(200).render("pages/welcome", token);
    } else {
      res.status(500).render("pages/login");
    }
  }
  console.log(username, password);

  // res.render('pages/welcome')
};

/**
 * @route create table /user/generateTable
 */
exports.createTable = async (req, res) => {
  try {
    let create = await model.generateTable();
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
