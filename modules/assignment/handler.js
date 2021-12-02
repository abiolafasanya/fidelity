const db = require("../../utils/db");
const path = require("path");
const { v4: uuid } = require("uuid");
const model = require("./model");
const excelJS = require("exceljs");
let app = require("express").Router()
const {flash} = require("express-flash-message")
const session = require("express-session")

app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 *7
    }
  })
);

app.use(flash({sessionKeyName: 'flashMessage'}));

/**
 * @route index page /assignment/generateTable
 */
exports.index = (req, res) => {
  console.log("submit page");
  res.render('pages/submit')
};

/**
 * @route create table /assignment/generateTable
 */
exports.createTable = async (req, res) => {
  try {
    let create = await model.generateTable();
    if (create.length > 0) {
      res.send("error: table not created");
    } else {
      res.send("table created");
    }
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
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
    date: new Date(),
    due_date: "",
  };
  console.log(data);
  let submit = await model.submitAssignment(data);
  if (submit.length > 0) {
    // res.json({ ok: true, message: "assignment submitted", data: submit });
    let message = "Assignment submitted"
    await req.flash('info', message)
    res.redirect("/assignment")
  } else {
    res.json({ ok: false, message: "assignment not submitted" });
  }
};

exports.getAssignments = async (req, res) => {
  // console.log("get assignments");
  let assignments = await model.getAssignments();
  if (assignments.length > 0) {
    res.render("pages/index", {assignments, message: false});
  } else {
    res.render("pages/index", {assignments, message: false});
    // res.json({ ok: false, assignment, message: "no assignments" });
  }
};

exports.deleteAssignment = async (req, res) => {
  const id = req.params.id
  console.log(id)
  const assignment = await model.deleteAssignment(req.params.id)
  if (assignment) {
    let message= 'Assignment Deleted'
    req.flash('info', message)
    res.redirect('/assignment')
  }
}

let dateFormat = (date) => {
  date.toLocaleString();
  return date;
};

 exports.exportAssignment = (req, res) => {
    const workbook = new excelJS.Workbook();  // Create a new workbook
    const worksheet = workbook.addWorksheet("My Assignment"); // New Worksheet
    let assignments = model.getAssignments();
    const file = "./download";  // Path to download excel
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
}
