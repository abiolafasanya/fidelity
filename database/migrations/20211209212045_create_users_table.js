exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id");
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
    table.time("created_at")
    table.time("updated_at")
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());  
  });
};

exports.down = function (knex) {
    return knex.schema
    .dropTable('users')
};
