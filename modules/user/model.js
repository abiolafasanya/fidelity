const {dbmysql: db} = require("../../utils/db");

// async function createDB(dbName) {
//   await db.raw('CREATE DATABASE IF NOT EXIST ??', dbName)
//  }
//  createDB('fidelity')



exports.login = (body) => {
  return db("users").select("*").where(body).first();
};

exports.getAll = () => {
  return db("users").select("*");
};

exports.findOne = (body) => {
  return db("users").where(body).first();
};

exports.register = async (body) => {
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

exports.updateToken = (id, token) => {
  return db('users').update(token).where('id', id)
}

exports.up = async () => {
  // Create a table
 let create =  await db.schema
    .createTable("users", (table) => {
      table.increments("id");
      table.string("username");
      table.string("classId");
      table.string("photo");
      table.string("student_id");
      table.string("password");
      table.boolean("isAdmin");
      table.boolean("isTeacher");
      table.string("token");
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
  .dropTableIfExists("profile")
}