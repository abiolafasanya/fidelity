require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const db = require("./utils/db");
const { PORT } = process.env || 3000;
const session = require("express-session")
const {flash} = require("express-flash-message")
// const flash = require("connect-flash")

app.use(
  session({
    secret: "flashMessage",
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 3600}
  })
);

app.use(flash());

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

/* Static file serving */
app.use(express.static("public"));
app.use(express.json());
// set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", "views");
app.set("port", PORT || 3000);
const ip = require("public-ip")

// routes component
const route = (moduleName) => require(`./modules/${moduleName}/routes`);

// routes -> for the modules
app.use("/user", route("user"));
app.use("/assignment", route("assignment"));

const { notFoundErrorHandler, serverErrorHandler } = require("./utils/helpers");
app.use(serverErrorHandler);
app.use(notFoundErrorHandler);

module.exports = app;
