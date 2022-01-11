exports.up = function (knex) {
  return knex.schema
    .createTable("assignment", (table) => {
      table.increments();
      table.string("subject");
      table.string("studentClass");
      table.string("name");
      table.string("files");
      table.string("description");
      table.date("due_date");
      table.timestamps(true, true);
    })
};

exports.down = function (knex) {
  return knex.schema.dropTable("assignment");
};
