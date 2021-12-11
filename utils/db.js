let sqlite3 = require("sqlite3");
let dbname = "./db/fidelity.sqlite3";

const dbsqlite = require("knex")({
  client: "sqlite3",
  connection: {
    filename: dbname,
  },
});

const connection = {
  host: "127.0.0.1",
  user: "root",
  password: "",
  port: 3306,
  database: "fidelity",
};

const migrations = {
  tableName: 'knex_migration'
}

const dbmysql = require("knex")({
  client: "mysql",
  connection,
  migrations
});

module.exports = { dbmysql, dbsqlite };
