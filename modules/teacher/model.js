require("dotenv").config();
const path = require("path");
const knexConfig = require(path.resolve("./database/knexfile"));
const db = require("knex")(knexConfig[process.env.NODE_ENV]);


exports.getAssignments = (req, res) => {
    return db("assignment_submission").select("*");
  };

  exports.createAssignment = (body) => {
    return db("assignment").insert(body);
  };