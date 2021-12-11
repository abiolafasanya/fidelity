const path = require("path");
const knexConfig = require(path.resolve("./database/knexfile"));
const db = require("knex")(knexConfig[process.env.NODE_ENV]);

exports.getAssignments = (req, res) => {
  return db("assignment_submission").select("*");
};

exports.getAssignmentsByClass = (classId) => {
  return db("assignment_submission").select("*").where({ classId });
};

exports.submitAssignment = (body) => {
  return db("assignment_submission").insert(body);
};

exports.gradeAssignment = (id, score) => {
  if (score > 100) return false;
  if (score == 0 || score > 0)
    return db("assignment_submission")
      .where({ id: id })
      .update({ score: score });
  else return false;
};

exports.createAssignment = (body) => {
  return db("assignments").insert(body);
};

exports.updateAssignment = (id, body) => {
  return db("assignments").update(body).where({ id });
};

exports.deleteAssignment = (id) => {
  return db("assignment_submission").where("id", id).del();
};
