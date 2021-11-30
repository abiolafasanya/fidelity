require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const db = require("./utils/db");
const { PORT } = process.env || 3000;

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

/* Static file serving */
app.use(express.static("public"));
app.use(express.static(path.resolve("public")));
// app.use(express.static(path.resolve("upload")));
// routes component
const route = (moduleName) => require(`./modules/${moduleName}/routes`);

// routes -> for the modules
// app.use("/user", route("user"));
app.use("/assignment", route("assignment"));

app.listen(PORT, () => {
  console.log("Server running on port %d", PORT);
});
