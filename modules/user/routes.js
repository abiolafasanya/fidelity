const router = require("express").Router();
const controller = require("./handler");
const path = require("path");
const { upload } = require(path.resolve("utils/uploads"));
const { auth, isLoggedIn } = require(path.resolve("middleware/auth"));
const passport = require("passport");

router.get("/register", isLoggedIn, controller.register);
router.post(
  "/register",
  isLoggedIn,
  upload.single("photo"),
  controller.createUser
);

router.get("/login", isLoggedIn, controller.loginPage);
router.post(
  "/login",
  isLoggedIn,
  controller.login,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    console.log("Request User", req.user);
    if (req.user.isAdmin) return res.redirect("/admin");
    else if (req.user.isTeacher) return res.redirect("/teacher");
    else res.redirect("/dashboard");
  }
);
router.delete("/logout", controller.logout);
router.get("/user/all", controller.getUsers);
router.get("/dashboard", auth, controller.dashboard);
// router.get("/dashboard", controller.dashboard);

module.exports = router;
