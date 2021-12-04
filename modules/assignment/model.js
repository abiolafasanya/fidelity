const db = require("../../utils/db");

exports.generateTable = async () => {
  // Create a table
  await db.schema
    .createTable("assignment", (table) => {
      table.increments("id");
      table.string("subject");
      table.string("studentClass");
      table.string("name");
      table.string("files");
      table.string("description");
      table.timestamp("created_at").defaultTo(db.fn.now());
      table.date("due_date");
    })

    .createTable("assignment_submission", (table) => {
      table.increments("id");
      table.string("name");
      table.string("files");
      table.string("studentClass");
      table.string("subject");
      table.integer("score");
      table.timestamp("submitted_at").defaultTo(db.fn.now());
      table.string("due_date");
      //   table
      //     .integer('assignment_id')
      //     .unsigned()
      //     .references('assignment.id');
      //   table
      //     .integer('account_id')
      //     .unsigned()
      //     .references('accounts.id');
    });
};

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
  if (score == 0 || score > 0) 
    return db("assignment_submission")
      .where({id: id})
      .update({ score: score })
  else return false
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
