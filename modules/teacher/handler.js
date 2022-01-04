require("dotenv").config();
const path = require("path");
const { findOne } = require(path.resolve("utils/helpers"));
const model = require("./model");
const { SECRET } = process.env || "mysecret";

exports.dashboard = async (req, res) => {
    let message = await req.flash("info");
    let user = await findOne({id: await req.user});
    const { id, first_name, last_name, role, username, isAdmin, isTeacher } =
      user;
      console.log("Teacher dashboard : ", {user}, req.user)
    let data = { id, first_name, last_name, username, role, isAdmin, isTeacher };
    res.render("teacher/dashboard", { message, loggedIn: true, data });
  };