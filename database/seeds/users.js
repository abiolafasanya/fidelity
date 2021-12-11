const bcrypt = require("bcrypt")

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        {
          id: 1,
          first_name: "Abiola",
          last_name: "Fasabya",
          username: "afasanya",
          password: bcrypt.hashSync('test', 10),
          role: "teacher",
          isAdmin: false,
          isTeacher: true,
          student_id: "",
        },
        {
          id: 2,
          first_name: "Hester",
          last_name: "Hester Owens",
          username: "howens",
          password: bcrypt.hashSync('test', 10),
          role: "student",
          isAdmin: true,
          isTeacher: false,
          student_id: "",
        },
        {
          id: 3,
          first_name: "Henry",
          last_name: "Jackson",
          username: "hjackson",
          password: bcrypt.hashSync('test', 10),
          role: "student",
          isAdmin: false,
          isTeacher: false,
          student_id: "",
        },
      ]);
    });
};
