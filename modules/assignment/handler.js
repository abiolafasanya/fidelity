const path = require("path");
const { v4: uuid } = require("uuid");
const model = require("./model");
const excelJS = require("exceljs");
let app = require("express").Router();
const session = require("express-session");
// const flash = require("connect-flash")
const { flash } = require("express-flash-message");
const { downloadResource, findOne } = require("../../utils/helpers");

app.use(
  session({
    secret: "flashMessage",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600 },
  })
);

app.use(flash({ sessionKeyName: "flashMessage" }));

/**
 * @route index page /assignment/generateTable
 */

exports.dashboard = async (req, res) => {
  let message = await req.flash("info");
  let data = await findOne({ id: await req.user });
  console.log({ user_data: data });

  res.render("teacher/index", { message, loggedIn: true, data });
};

exports.index = async (req, res) => {
  console.log("submit page");
  let message = await req.flash("info");
  console.log(await req.user);
  let student = await findOne({ id: await req.user });
  const { id, first_name, last_name, role, username, isAdmin, isTeacher } =
    student;
  let data = { id, first_name, last_name, username, role, isAdmin, isTeacher };
  console.log(student);

  res.render("pages/submit", { loggedIn: true, message, data });
};

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
    res.render("pages/results", { assignments, data, message, loggedIn: true });
  } else {
    let data = {
      ok: false,
      message: "Assignment not Available",
    };
    let message = await req.flash("message");
    res.render("pages/results", { data, message, loggedIn: true });
  }
};

/**
 * @route submit /assignment/submit
 */
exports.submit = async (req, res) => {
  // console.log("submit assignment");
  let files =
    req.file === undefined || null
      ? "no file"
      : req.file.filename || req.body.upload;
  let { name, classId, subject, upload } = req.body;
  let data = {
    user_id: await req.user,
    name,
    studentClass: classId,
    files,
    subject,
    due_date: "",
  };
  console.log(data);
  let submit = await model.submitAssignment(data);
  if (submit) {
    await req.flash("loggedIn", true);
    // res.redirect("/dashboard");
    res.status(200).json({ message: "Assignment Submitted", ok: true });
  }
};

exports.deleteAssignment = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const assignment = await model.deleteAssignment(req.params.id);
  if (assignment) {
    req.flash("info", "Assignment Deleted");
    res.redirect("/admin");
  }
};

exports.exportAssignment = (req, res) => {
  const workbook = new excelJS.Workbook(); // Create a new workbook
  const worksheet = workbook.addWorksheet("My Assignment"); // New Worksheet
  let assignments = model.getAssignments();
  const file = "./download"; // Path to download excel
  // Column for data in excel. key must match data key
  worksheet.columns = [
    { header: "S no.", key: "s_no", width: 10 },
    { header: "ID", key: "id", width: 10 },
    { header: "Student Name", key: "name", width: 10 },
    { header: "Subject", key: "subject", width: 10 },
    { header: "Class", key: "class", width: 10 },
    { header: "Files", key: "files", width: 10 },
    { header: "Date", key: "date", width: 10 },
  ];
  // Looping through assognment data
  let counter = 1;
  assignments.forEach((assignment) => {
    assignment.s_no = counter;
    worksheet.addRow(assignment); // Add data in worksheet
    counter++;
  });
};

exports.grade = async (req, res) => {
  // let id = req.body.student_id;
  let id = req.params.id;
  let score = req.body.score;
  if (!id && !score) {
    let message = "Assignment Not Graded unprocessed fields";
    req.flash("info", message);
    res.redirect("/assignment/results");
  }
  let grade = await model.gradeAssignment(id, score);
  if (grade) {
    let message = "Assignment Graded";
    req.flash("info", message);
    res.redirect("/teacher");
  } else {
    let message = "Assignment Not Graded";
    req.flash("message", message);
    res.redirect("/teacher");
  }
  // console.log(id, score);
};

exports.createTask = (req, res) => {
  res.json("creat task handler");
};
