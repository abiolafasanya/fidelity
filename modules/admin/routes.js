const router = require("express").Router();
const controller = require("./handler");
const path = require("path")
const { upload } = require(path.resolve("utils/uploads"));
const { auth, isLoggedIn } = require(path.resolve("middleware/auth"));

// create table
router.get("/superAdmin", controller.superAdmin);

router.get("/create-user", auth, controller.register);
router.post(
  "/create-user",
  auth,
  upload.single("photo"),
  controller.createUser
);

router.get("/all", auth, controller.getUsers);
router.get("/dashboard", auth, controller.dashboard);

// destroy table

module.exports = router;
