const db = require("../../utils/db");
const path = require("path");
const { v4: uuid } = require("uuid");
const model = require("./model");

exports.home = (req, res) => {
  console.log("submit page");
  res.sendFile(path.resolve("./public/index.html"));
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
  let { name, classId } = req.body;
  let data = {
    name,
    studentClass: classId,
    files,
    subject: "computer",
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
    assignments.forEach((assignment) => {
      let data = {
        name: assignment.name,
        files: assignment.files,
        studentClass: assignment.studentClass,
        subject: assignment.subject,
        date: assignment.date,
        due_date: assignment.due_date,
      };
      res.json({ ok: true, message: "assignments retrieved", data });
    });
  } else {
    res.json({ ok: false, message: "no assignments" });
  }
};
