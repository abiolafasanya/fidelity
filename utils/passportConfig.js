const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport, getUserbyUsername, getUserById) {
  const authenticate = async (username, password, done) => {
    const user = await getUserbyUsername(username);
    if (user == null) {
      return done(null, false, { message: "no user with this username" });
    }

    try {
      if (bcrypt.compareSync(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "password incorrect" });
      }
    } catch (err) {
      return done(err);
    }
  };

  passport.use(new LocalStrategy({ usernameField: "username" || "student_id" }, authenticate));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id));
  });
}

module.exports = initialize;
