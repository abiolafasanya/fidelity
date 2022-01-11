const path = require("path");
const knexConfig = require(path.resolve("./database/knexfile"));
const db = require("knex")(knexConfig[process.env.NODE_ENV]);


exports.login = (body) => {
  return db("users").select("*").where(body).first();
};

exports.getAll = () => {
  return db("users").select("*");
};

exports.findOne = (body) => {
  return db("users").where(body).first();
};

exports.create = async (body) => {
  return db("users").insert(body);
};

exports.studentId = async (body) => {
  return db("users").update(body).where({ id });
};

exports.update = (id, body) => {
  return db("users").update({ body }).where({ id });
};

exports.delete = (id) => {
  return db("users").delete({ id });
};

exports.getAssignments = (req, res) => {
  return db("assignment_submission").select("*");
};