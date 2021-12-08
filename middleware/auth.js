const { info, error, success } = require("consola");

exports.auth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  else res.redirect("/user/login");
};

exports.admin = async (req, res, next) => {
  if (!req.user.isAdmin) {
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
  if (!req.user.isTeacher) {
    error({ message: "only teachers are allowed", badge: true });
    return res.status(401).json({
      ok: false,
      message: "only teachers have access to perform operation",
    });
  }
  info({ message: "teacher access granted...", badge: true });
  next();
};
