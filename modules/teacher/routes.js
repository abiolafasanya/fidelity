const router = require("express").Router();
const controller = require("./handler");
const path = require("path");
const { upload } = require(path.resolve("utils/uploads"));
const { auth, teacher } = require(path.resolve("middleware/auth"));

router.get("/", [auth, teacher], controller.dashboard);

module.exports = router;
