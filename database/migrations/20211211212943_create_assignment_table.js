exports.up = function (knex) {
  return knex.schema
    .createTable("assignment", (table) => {
      table.increments("id");
      table.string("subject");
      table.string("studentClass");
      table.string("name");
      table.string("files");
      table.string("description");
      table.date("due_date");
      table.timestamps(true, true)
    })

    .createTable("assignment_submission", (table) => {
      table.increments();
      table.integer("user_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE");
      //   table.integer("assignment_id").unsigned().references("assignment.id");
      table.string("name");
      table.string("files");
      table.string("studentClass");
      table.string("subject");
      table.integer("score");
      table.string("due_date");
      table.timestamps(true, true) 
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable("assignment");
};

exports.down = function (knex) {
  return knex.schema.dropTable("assignment_submission");
};
