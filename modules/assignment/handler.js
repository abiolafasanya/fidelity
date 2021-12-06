const db = require("../../utils/db");
const path = require("path");
const { v4: uuid } = require("uuid");
const model = require("./model");
const excelJS = require("exceljs");
let app = require("express").Router();
const session = require("express-session");
// const flash = require("connect-flash")
const { flash } = require("express-flash-message");
const { downloadResource } = require('../../utils/helpers');


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
exports.index = async (req, res) => {
  console.log("submit page");
  let message = await req.consumeFlash("info");
  res.render("pages/submit", { ok: true, message });
};

exports.getAssignments = async (req, res) => {
  let assignments = await model.getAssignments();
  if (assignments.length > 0) {
    let data = {
      ok: true,
      message: "Assignment Available",
      assignments,
    };
    let message = await req.consumeFlash("message");
    res.render("pages/results", { assignments, data, message });
  } else {
    let data = {
      ok: false,
      message: "Assignment Available",
    };
    let message = await req.consumeFlash("message");
    res.render("pages/results", { data, message });
  }
};

/**
 * @route submit /assignment/submit
 */
exports.submit = async (req, res) => {
  // console.log("submit assignment");
  let files = req.file === undefined || null ? "no file" : req.file.filename;
  let { name, classId, subject } = req.body;
  let data = {
    name,
    studentClass: classId,
    files,
    subject,
    due_date: "",
  };
  console.log(data);
  let submit = await model.submitAssignment(data);
  if (submit) {
    let message = "Assignment Submitted";
    await req.flash("info", message);
    res.redirect("/assignment");
  }
};

exports.deleteAssignment = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const assignment = await model.deleteAssignment(req.params.id);
  if (assignment) {
    let message = "Assignment Deleted";
    req.flash("message", message);
    res.redirect("/assignment/results");
  }
};

let dateFormat = (date) => {
  date.toLocaleString();
  return date;
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

/**
 * @route create table /assignment/generateTable
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

exports.grade = async (req, res) => {
  // let id = req.body.student_id;
  let id = req.params.id;
  let score = req.body.score;
  if(!id && !score) {
    let message = "Assignment Not Graded unprocessed fields";
    req.flash("message", message);
    res.redirect("/assignment/results");
  };
  let grade = await model.gradeAssignment(id, score);
  if (grade) {
    let message = "Assignment Graded";
    req.flash("message", message);
    res.redirect("/assignment/results");
  } else {
    let message = "Assignment Not Graded";
    req.flash("message", message);
    res.redirect("/assignment/results");
  }
  // console.log(id, score);
};


exports.downloadExcel = async (req, res) => {

 let controller = {};

  let fields = [
    {
      label: 'username',
      value: 'username'
    },
    {
      label: 'subject',
      value: 'subject'
    },
    {
     label: 'class',
      value: 'classId'
    },
    {
      label: 'score',
       value: 'score'
     }
  ];
  const data = await model.getAssignments();

  return downloadResource(res, 'assignment.csv', fields, data);
 }