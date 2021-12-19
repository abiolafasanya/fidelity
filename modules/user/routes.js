const router = require("express").Router();
const controller = require("./handler");
const path = require("path")
const { upload } = require(path.resolve("utils/uploads"));
const { auth, isLoggedIn } = require(path.resolve("middleware/auth"));
const passport = require("passport");

router.get("/register", isLoggedIn, controller.register);
router.post("/register", isLoggedIn, upload.single("photo"), controller.createUser);

router.get("/login", isLoggedIn, controller.loginPage);
router.post(
  "/login",
  isLoggedIn,
  controller.login,
  passport.authenticate("local", {
    successRedirect: "/user/dashboard",
    failureRedirect: "/user/login",
    failureFlash: true,
  })
);
router.delete("/logout", controller.logout);
router.get("/all", controller.getUsers);
router.get("/dashboard", auth, controller.dashboard);
// router.get("/dashboard", controller.dashboard);

module.exports = router;
