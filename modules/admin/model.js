const path = require("path");
const knexConfig = require(path.resolve("./database/knexfile"));
const db = require("knex")(knexConfig[process.env.NODE_ENV]);


exports.login = (body) => {
  return db("users").select("*").where(body).first();
};

exports.getAll = () => {
  return db("users").select("*");
};

exports.findOne = (body) => {
  return db("users").where(body).first();
};

exports.create = async (body) => {
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

exports.up = async () => {
  // Create a table
 let create =  await db.schema
    .createTable("users", (table) => {
      table.increments("id");
      table.string("username");
      table.string("classId");
      table.string("photo");
      table.string("teacher_id");
      table.string("password");
      table.boolean("isTeacher");
      table.timestamp("created_at").defaultTo(db.fn.now());
    })
    // ...and another
    .createTable("profile", (table) => {
      table.increments("id");
      table.string("username");
      table.integer("user_id").unsigned().references("users.id");
    });
    return create
};

exports.down =  async () => {
  return await db.schema
  .dropTableIfExists("users")
}