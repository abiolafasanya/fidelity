const router = require("express").Router();
const controller = require("./handler");
const path = require("path");
const { upload } = require(path.resolve("utils/uploads"));
const { auth, admin } = require(path.resolve("middleware/auth"));

// create table
router.get("/", auth, admin, controller.dashboard);

router.get("/superAdmin", controller.superAdmin);
router.get("/create-user", auth, controller.register);
router.post(
  "/create-user",
  auth,
  upload.single("photo"),
  controller.createUser
);

router.get("/all", auth, controller.getUsers);

// destroy table

module.exports = router;
