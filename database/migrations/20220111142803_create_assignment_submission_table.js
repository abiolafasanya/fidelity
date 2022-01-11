exports.up = function (knex) {
    return knex.schema
      .createTable("assignment_submission", (table) => {
        table.increments();
        table
          .integer("user_id")
          .unsigned()
          .notNullable()
          .references("id")
          .inTable("users")
          .onDelete("CASCADE");
        table
          .integer("assignment_id")
          .unsigned()
          .notNullable()
          .references("id")
          .inTable("assignment")
          .onDelete("CASCADE");
        table.string("name");
        table.string("files");
        table.string("studentClass");
        table.string("subject");
        table.integer("score");
        table.string("due_date");
        table.timestamps(true, true);
      });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable("assignment_submission");
  };
  