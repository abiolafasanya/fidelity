const { findOne } = require("../utils/helpers");
const { info, error, success } = require("consola");

exports.auth = async (req, res, next) => {
  if (req.isAuthenticated()) return next();
  else {
    let message = "You have to login";
    await req.flash("info", message);
    res.redirect("/user/login")
  };
};

exports.isLoggedIn = async (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log("you are already loggedIn");
    let message = "You are already loggedIn";
    await req.flash("info", message);
    return res.redirect("/user/dashboard");
  }
  console.log("proceed to login");
  next();
};

exports.admin = async (req, res, next) => {
  console.log(await req.user, "user id");
  let user = await findOne({ id: await req.user });
  if (!user.isAdmin) {
    error({ message: "only admin are allowed", badge: true });
    return res
      .status(401)
      .json({ ok: false, message: "only admins  are  allowed" });
  }
  info({ message: "admin access granted...", badge: true });
  success({ message: "processing dashboard...", badge: true });
  next();
};

exports.teacher = async (req, res, next) => {
  let user = await findOne({ id: await req.user });
  if (!user.isTeacher) {
    error({ message: "only teachers are allowed", badge: true });
    return res.status(401).json({
      ok: false,
      message: "only teachers have access to perform operation",
    });
  }
  info({ message: "teacher access granted...", badge: true });
  next();
};
