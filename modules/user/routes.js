const router = require("express").Router();
const controller = require("./handler");
const { upload } = require("../../utils/uploads");
const passport = require("passport");
const initalizePassport = require("../../utils/passportConfig");
const {isLoggedIn} = require("../../middleware/is");

router.get("/generateTable", controller.createTable);
router.get("/register", controller.register);
router.post("/register", upload.single("photo"), controller.createUser);

router.get("/login", controller.loginPage);
// router.post("/login", controller.login);
router.post(
  "/login",
  controller.login,
  passport.authenticate("local", {
    successRedirect: "/assignment/results",
    failureRedirect: "/user/login",
    failureFlash: true,
  })
);
router.get("/all", controller.getUsers);
router.get("/dashboard", controller.dashboard);
router.get("/clearDb", controller.removeTable);

module.exports = router;
