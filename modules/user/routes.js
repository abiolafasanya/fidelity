const router = require("express").Router();
const controller = require("./handler");
const { upload } = require("../../utils/uploads");
const passport = require("passport");
const { auth, isLoggedIn } = require("../../middleware/auth");

router.get("/generateTable", controller.createTable);
router.get("/register", isLoggedIn, controller.register);
router.post("/register", isLoggedIn, upload.single("photo"), controller.createUser);

router.get("/login", isLoggedIn, controller.loginPage);
router.post(
  "/login",
  isLoggedIn,
  controller.login,
  passport.authenticate("local", {
    successRedirect: "/assignment/results",
    failureRedirect: "/user/login",
    failureFlash: true,
  })
);
router.delete("/logout", controller.logout);
router.get("/all", controller.getUsers);
router.get("/dashboard", controller.dashboard);
router.get("/clearDb", controller.removeTable);

module.exports = router;
