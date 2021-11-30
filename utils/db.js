let sqlite3 = require("sqlite3");
let dbname = "./db/fidelity.sqlite3"

const db = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: dbname,
  },
});

module.exports = db;
