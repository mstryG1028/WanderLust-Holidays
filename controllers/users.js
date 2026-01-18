const User = require("../models/user");

module.exports.renderSignUpForm = (req, res) => {
  return res.render("signup.ejs");
};

module.exports.signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) {
        req.flash("error", err.message);
        return res.redirect("/login");
      }

      req.flash("success", "Welcome to Wanderlust!");
      return res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    return res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  return res.render("login.ejs");
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Logged Out!");
    return res.redirect("/listings");
  });
};
