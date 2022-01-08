exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments();
    table.string("first_name", 255);
    table.string("last_name", 255);
    table.string("username", 255);
    table.string("classId");
    table.string("photo");
    table.string("student_id", 255);
    table.string("password", 255);
    table.boolean("isAdmin");
    table.boolean("isTeacher");
    table.string("role");
    table.timestamps(true, true)  
  });
};

exports.down = function (knex) {
    return knex.schema
    .dropTable('users')
};
