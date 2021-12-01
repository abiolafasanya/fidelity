const db = require("../../utils/db");
const path = require("path");
const { v4: uuid } = require("uuid");
const model = require("./model");
const excelJS = require("exceljs");

exports.home = (req, res) => {
  console.log("submit page");
  // res.sendFile(path.resolve("./public/index.html"));
  res.render('pages/submit')
};

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

exports.submit = async (req, res) => {
  console.log("submit assignment");
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
    res.json({ ok: true, message: "assignment submitted", data: submit });
  } else {
    res.json({ ok: false, message: "assignment not submitted" });
  }
};

exports.getAssignments = async (req, res) => {
  console.log("get assignments");
  let assignments = await model.getAssignments();
  if (assignments.length > 0) {
  
    console.log(assignments);
    // res.json({ ok: true, message: "assignments retrieved", data: assignments });
    // res.render("assignment/submitted", { assignments });
    res.render("pages/index", { assignments });
  } else {
    res.json({ ok: false, message: "no assignments" });
  }
};

let dateFormat = (date) => {
  date.toLocaleString();
  return date;
};

 exports.exportAssignment = (req, res => {
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
})