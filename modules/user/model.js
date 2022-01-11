const path = require("path");
const knexConfig = require(path.resolve("./database/knexfile"));
const db = require("knex")(knexConfig[process.env.NODE_ENV]);


// async function createDB(dbName) {
//   await db.raw('CREATE DATABASE IF NOT EXIST ??', dbName)
//  }
//  createDB('fidelity')

exports.login = (body) => {
  return db("users").select("*").where(body).first();
};

exports.getAll = () => {
  return db("users").select("*");
};

exports.findOne = (body) => {
  return db("users").where(body).first();
};

exports.register = async (body) => {
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

exports.updateToken = (id, token) => {
  return db("users").update(token).where("id", id);
};

exports.getAssignments = (req, res) => {
  return db("assignment_submission").select("*");
};
