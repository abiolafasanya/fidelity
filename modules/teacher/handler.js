require("dotenv").config();
const path = require("path");
const { findOne } = require(path.resolve("utils/helpers"));
const model = require("./model");
const { SECRET } = process.env || "mysecret";

// exports.dashboard = async (req, res) => {
//     let message = await req.flash("info");
//     let user = await findOne({id: await req.user});
//     const { id, first_name, last_name, role, username, isAdmin, isTeacher } =
//       user;
//       console.log("Teacher dashboard : ", {user}, req.user)
//     let data = { id, first_name, last_name, username, role, isAdmin, isTeacher };
//     res.render("teacher/dashboard", { message, loggedIn: true, data });
//   };

  exports.dashboard = async (req, res) => {
    let message = await req.flash("info");
    let data = await findOne({ id: await req.user });
    console.log("teacher", { user_data: data });
    let assignments = await model.getAssignments()
    res.render("teacher/index", { message, loggedIn: true, data, assignments });
  };

  exports.assignment = async (req, res) => {

  }

  exports.getAssignments = async (req, res) => {
    let assignments = await model.getAssignments();
    if (assignments.length > 0) {
      let data = {
        ok: true,
        message: "Assignment Available",
        assignments,
      };
      console.log(data);
      let message = await req.flash("message");
      res.status(200).json({ assignments, data, message, loggedIn: true });
    } else {
      let data = {
        ok: false,
        message: "Assignment not Available",
      };
      let message = await req.flash("message");
      res.status(400).json({ data, message, loggedIn: true });
    }
  };