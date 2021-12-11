exports.up = function (knex) {
  return knex.schema
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
      table.string("due_date");
      table.timestamps();
      table.integer("assignment_id").unsigned().references("assignment.id");
      table.integer("user_id").unsigned().references("user.id");
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable("assignment");
};
