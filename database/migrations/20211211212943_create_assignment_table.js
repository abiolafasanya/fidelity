exports.up = function (knex) {
  return knex.schema
    .createTable("assignment", (table) => {
      table.increments();
      table
          .integer("teacher_id")
          .unsigned()
          .notNullable()
          .references("id")
          .inTable("users")
          .onDelete("CASCADE");
      table.string("subject");
      table.string("studentClass");
      table.string("title");
      table.string("files");
      table.string("description");
      table.date("due_date");
      table.timestamps(true, true);
    })
};

exports.down = function (knex) {
  return knex.schema.dropTable("assignment");
};
