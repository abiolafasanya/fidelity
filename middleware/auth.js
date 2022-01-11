const { findOne } = require("../utils/helpers");
const { info, error, success } = require("consola");

exports.auth = async (req, res, next) => {
  if (req.isAuthenticated()) return next();
  else {
    let message = "You have to login";
    await req.flash("info", message);
    res.redirect("/login");
  }
};

exports.isLoggedIn = async (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log("you are already loggedIn");
    let message = "You are already loggedIn";
    await req.flash("info", message);
    let user = await findOne({ id: await req.user });
    if (user.isAdmin) return res.redirect("/admin");
    else if (user.isTeacher) return res.redirect("/teacher");
    else res.redirect("/dashboard");
  }
  console.log("proceed to login");
  next();
};

exports.admin = async (req, res, next) => {
  console.log(await req.user, "user id");
  let user = await findOne({ id: await req.user });
  if (!user.isAdmin) {
    error({ message: "only admin are allowed", badge: true });
    let message = "Only admin are allowed";
    req.flash("info", message);
    return res.status(401).redirect("/dashboard");
  }
  info({ message: "admin access granted...", badge: true });
  next();
};

exports.teacher = async (req, res, next) => {
  let user = await findOne({ id: await req.user });
  if (!user.isTeacher) {
    let message = "only teachers have access to perform operation";
    error({ message: "only teachers are allowed", badge: true });
    req.flash("info", message);
    return res.status(401).redirect("/dashboard");
  }
  info({ message: "teacher access granted...", badge: true });
  next();
};
