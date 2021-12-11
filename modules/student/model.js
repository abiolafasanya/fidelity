const path = require("path");
const knexConfig = require(path.resolve("./database/knexfile"));
const db = require("knex")(knexConfig[process.env.NODE_ENV]);