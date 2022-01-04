const ip = require("public-ip");
const { Parser } = require("json2csv");
const path = require("path");
const knexConfig = require(path.resolve("./database/knexfile"));
const db = require("knex")(knexConfig[process.env.NODE_ENV]);

exports.findOne = async (query) => {
  let user = db("users").where(query).first();
  const {
    id,
    first_name,
    last_name,
    role,
    username,
    classId,
    isAdmin,
    isTeacher,
    created_at,
    updated_at,
  } = await user;

  let data = {
    id,
    first_name,
    last_name,
    username,
    classId,
    role,
    isAdmin,
    isTeacher,
    created_at,
    updated_at,
  };
  return data;
};

exports.countUser = async () => {
  let user = db("users")
  return user
}


exports.serverErrorHandler = async (err, req, res, next) =>
  res.status(500).render("error", {
    errorMessage: err.message,
    stack: err.stack,
    ip: await ip.v4(),
  });

exports.notFoundErrorHandler = async (req, res, next) =>
  res.status(404).render("404", { path: req.path, method: req.method });

exports.downloadResource = async (res, fileName, fields, data) => {
  const json2csv = new Parser({ fields });
  const csv = json2csv.parse(data);
  res.header("Content-Type", "text/csv");
  res.attachment(fileName);
  return res.send(csv);
};

exports.validateInput = (data) => {
  let { username, password, cpassword } = data;
  if (password !== cpassword) {
    res.status(400).json({ ok: false, message: "password do not match" });
  }
  if (password.length < 8) {
    res
      .status(400)
      .json({ ok: false, message: "password must be 8 digit and above" });
  }
  if (username.length < 3) {
    res
      .status(400)
      .json({ ok: false, message: "username must be more than 3 digit" });
  }
};

//  staticBackdrop/<% id >%
